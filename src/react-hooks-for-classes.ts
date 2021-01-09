import { Component } from 'react'

export class ReactClassHook<T> {
  public props: T
  public readonly getProps: () => T

  constructor(getProps: () => T) {
    if (typeof getProps !== 'function') {
      throw new Error ('getProps callback must be a function')
    }

    this.getProps = getProps
  }

  hookDidMount () {}

  hookDidUpdate (prevProps: T) {}

  hookWillUnmount () {}
}

export function mountHook <P, S, T> (component: Component<P, S>, hook : ReactClassHook<T>) {
  // @ts-ignore
  if (component.hooks === undefined) {
    initializeHooks(component)
  }

  // @ts-ignore
  component.hooks.push(hook)
  hook.props = hook.getProps()
  hook.hookDidMount()
}

export function unmountHook <P, S, T> (component: Component<P, S>, hook : ReactClassHook<T>) {
  // @ts-ignore
  if (component.hooks === undefined) {
    return
  }

  // @ts-ignore
  const index = component.hooks.indexOf(hook)
  if (index !== -1) {
    // @ts-ignore
    component.hooks[index].hookWillUnmount()
    // @ts-ignore
    component.hooks.splice(index, 1)
  }
}

function initializeHooks <P, S> (component: Component<P, S>) {
  // @ts-ignore
  component.hooks = []

  // @ts-ignore
  component._componentDidUpdate = component.componentDidUpdate
  component.componentDidUpdate = function (prevProps, prevState, snapshot) {
    this.hooks.forEach(hook => {
      const prevProps = hook.props
      hook.props = hook.getProps()
      hook.hookDidUpdate(prevProps)
    })

    this._componentDidUpdate(prevProps, prevState, snapshot)
  }

  // @ts-ignore
  component._componentWillUnmount = component.componentWillUnmount
  component.componentWillUnmount = function () {
    this.hooks.forEach(hook => {
      hook.hookWillUnmount()
    })
    delete this.hooks

    this._componentWillUnmount()
  }
}
