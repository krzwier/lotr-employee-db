'use strict';

// import React from 'react';
// import ReactDOM from 'react-dom';
// import client from './client';
// import follow from './follow';
// import EmployeeList from './EmployeeList';
// import CreateDialog from './CreateDialog';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
const EmployeeList = require('./EmployeeList');
const CreateDialog = require('./CreateDialog');


const root = '/api';
class App extends React.Component {


    constructor(props) {
        super(props);
        this.state = { 
            employees: [], 
            attributes: [], 
            pageSize: 2, 
            links: {} 
        };
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        // this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    async loadFromServer(pageSize) {
        const response = await fetch(root + "/employees/?size=" + pageSize, {
            method: 'GET',
            // mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const schemaResponse = await fetch(data._links.profile.href, {
            method: 'GET',
            headers: {
                'Accept': 'application/schema+json'
            }
        });
        const schema = await schemaResponse.json();
        this.setState({
            employees: data._embedded.employees,
            attributes: Object.keys(schema.properties),
            pageSize: pageSize,
            links: data._links
        });
        


        // let paramObj = {
        //     size: pageSize
        // };
        // follow(client, root, [
        //     {rel: 'employees', params: paramObj}]
        // ).then(employeeCollection => {
        //     return client({
        //         method: 'GET',
        //         path: employeeCollection.entity._links.profile.href,
        //         headers: {'Accept': 'application/schema+json'}
        //     }).then(schema => {
        //         this.schema = schema.entity;
        //         this.setState({
        //             employees: employeeCollection.entity._embedded.employees,
        //             attributes: Object.keys(this.schema.properties),
        //             pageSize: pageSize,
        //             links: employeeCollection.entity._links});
        //         return employeeCollection;
        //     });
        // });
    }

    onCreate(newEmployee) {
        follow(client, root, ['employees']).then(employeeCollection => {
            return client({
                method: 'POST',
                path: employeeCollection.entity._links.self.href,
                entity: newEmployee,
                headers: { 'Content-Type': 'application/json' }
            })
        }).then(response => {
            return follow(client, root, [
                { rel: 'employees', params: { 'size': this.state.pageSize } }]);
        }).then(response => {
            if (typeof response.entity._links.last !== "undefined") {
                this.onNavigate(response.entity._links.last.href);
            } else {
                this.onNavigate(response.entity._links.self.href);
            }
        });
    }

    async onNavigate(navUri) {
        const response = await fetch(navUri, {
            method: 'GET'
        });
        const data = await response.json();
        this.setState({
            employees: data._embedded.employees,
            attributes: this.state.attributes,
            pageSize: this.state.pageSize,
            links: data._links
        })
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(Number(pageSize));
        }
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);
    }

    render() {
        return (
            <div>
                <CreateDialog attributes={this.state.attributes} onCreate={this.onCreate} />
                <EmployeeList
                    employees={this.state.employees}
                    links={this.state.links}
                    pageSize={this.state.pageSize}
                    onNavigate={this.onNavigate}
                    updatePageSize={this.updatePageSize} />
            </div>

        )
    }
}




ReactDOM.render(
    <App />,
    document.getElementById('react')
)