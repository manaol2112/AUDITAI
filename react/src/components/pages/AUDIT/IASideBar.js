import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles.css'; 
import logo from '/Users/apple/Desktop/auditai/auditai/auditai_ui/src/assets/images/logo.jpeg'
import * as mui from '@mui/material';
import Cookies from 'js-cookie'


class IASideBar extends Component {

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
                            <span>Audit Dashboard</span>
                        </li>
                        <li>
                            <i className="material-icons">folder_special</i>
                            <span>Workpapers</span>
                        </li>
                        <li>
                            <i className="material-icons">verified_user</i>
                            <span>Controls</span>
                        </li>
                        <li>
                            <i className="material-icons">bug_report</i>
                            <span>Risk</span>
                        </li>
                        <li>
                            <i className="material-icons">rebase_edit</i>
                            <span>Walkthroughs</span>
                        </li>
                        <li>
                            <i className="material-icons">pending_actions</i>
                            <span>Document Requests</span>
                        </li>
                        <li>
                            <i className="material-icons">warning</i>
                            <span>Deficiencies</span>
                        </li>
                        <li>
                            <i className="material-icons">tune</i>
                            <span>Settings</span>
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

export default IASideBar;
