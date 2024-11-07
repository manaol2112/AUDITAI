import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles.css'; 
import logo from '../../../../src/assets/images/logo.jpeg'
import * as mui from '@mui/material';
import Cookies from 'js-cookie'


class SysOwnerSideBar extends Component {

    state = {
        drawerPos: 1
    };

    handleDrawer = () => {
        if (this.state.drawerPos < 2) {
            this.setState((state) => ({
                drawerPos: state.drawerPos + 1
            }));
        } else {
            this.setState({
                drawerPos: 0
            });
        }
    };

    handleLogout = () => {
        localStorage.removeItem('token'); // Remove access token from localStorage
        Cookies.remove('token'); // Remove access token from cookies
        localStorage.removeItem('refresh_token'); // Remove refresh token from localStorage
        Cookies.remove('refresh_token'); // Remove refresh token from cookies
        Cookies.remove('groups'); // Remove access token from cookies
        Cookies.remove('csrftoken'); // Remove refresh token from cookies
        window.location.href = '/login';
    };

    render() {
        let drawerClass = [];
        let mainClass = [];

        if (this.state.drawerPos === 1) {
            drawerClass.push('drawerMin');
            mainClass.push('mainMin');
        } else if (this.state.drawerPos === 2) {
            drawerClass.push('drawerOpen');
            mainClass.push('mainOpen');
        } else {
            drawerClass = [];
            mainClass = [];
        }

        const { mainContent } = this.props;

        return (
            <div className="App">
                <navbar>
                    <i className="material-icons" onClick={this.handleDrawer}>
                        menu
                    </i>
                
                    <a className="navbar-brand" href="/" style={{ marginLeft: '10px' }}>
                        <img src={logo} width="35" height="35" className="d-inline-block align-top" alt="" />
                        <span className="menu-collapsed" style={{ marginLeft: '10px', fontSize: '25px', color: 'white' }}>Audit-AI</span>
                    </a>
                </navbar>
                <aside className={drawerClass.join(' ')}>
                    <ul>
                        <li>
                            <i className="material-icons">dashboard</i>
                            <span>Dashboard</span>
                        </li>
                        <li>
                            <i className="material-icons">grid_view</i>
                            <span>Applications</span>
                        </li>
                        <li>
                            <i className="material-icons">assured_workload</i>
                            <span>Compliance</span>
                        </li>
                        <li>
                            <i className="material-icons">lock_person</i>
                            <span>Access Requests</span>
                        </li>
                        <li>
                            <i className="material-icons">cloud_sync</i>
                            <span>Document Requests</span>
                        </li>
                        <li onClick={this.handleLogout}>
                            <i className="material-icons">logout</i>
                            <span>Logout</span>
                        </li>
                    </ul>
                </aside>

            <main className={mainClass.join(' ')}>
              {mainContent}
            </main>

            </div>
        );
    }
}

export default SysOwnerSideBar;
