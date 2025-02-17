import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './styles.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import logo from '../../assets/images/logo.jpeg';
import * as mui from '@mui/material';
import Cookies from 'js-cookie'
import { withRouter } from 'react-router-dom';  

class SideBar extends Component {

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

    handleHome = () => {
        window.location.href = '/Dashboard';
    };

    handleInterface = () => {
        window.location.href = '/Interfaces';
    };

    handleSecurity = () => {
        window.location.href = '/Security';
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

            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{
                
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
                        <li onClick={this.handleHome}>
                            <i className="material-icons">dashboard</i>
                            <span>Dashboard</span>
                        </li>
                        <li onClick={this.handleSecurity}>
                            <i className="material-icons">settings</i>
                            <span>Manage System</span>
                        </li>
                        <li onClick={this.handleInterface}>
                            <i className="material-icons">monitor</i>
                            <span>Jobs</span>
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

            }
            </div>
            
                   );
    }
}

export default SideBar;
