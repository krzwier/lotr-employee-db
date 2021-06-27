'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
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
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    async loadFromServer(pageSize) {
        const response = await fetch(root + "/employees/?size=" + pageSize, {
            method: 'GET',
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
    }

    async onCreate(newEmployee) {
        const origResponse = await fetch(root + "/employees", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await origResponse.json();
        const postResponse = await fetch(data._links.self.href, {
            method: 'POST',
            body: JSON.stringify(newEmployee),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const updatedResponse = await fetch(root + "/employees/?size=" + this.state.pageSize, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const updatedData = await updatedResponse.json();
        if (typeof updatedData._links.last !== "undefined") {
            this.onNavigate(updatedData._links.last.href);
        } else {
            this.onNavigate(updatedData._links.self.href);
        }
        
    
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

    async onDelete(employee) {
        const response = await fetch(employee._links.self.href, {
            method: 'DELETE',
        });
        this.loadFromServer(this.state.pageSize);
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
                    onDelete={this.onDelete}
                    updatePageSize={this.updatePageSize} />
            </div>

        )
    }
}




ReactDOM.render(
    <App />,
    document.getElementById('react')
)