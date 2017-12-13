import * as React from 'react'

export interface DashboardProps { }
export interface DashboardState { }

export default class Dashboard extends React.Component<DashboardProps, DashboardState> {
  render () {
    return (
      <div><h1>User's home page</h1></div>
    )
  }
}