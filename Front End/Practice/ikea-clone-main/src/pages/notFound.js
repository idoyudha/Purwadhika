import React from 'react';

class NotFound extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return (
            <div className="container p-5 text-center">
                <h1 style={{ fontSize: '3vw', fontWeight: 'bold' }}>404 Page Not Found</h1>
            </div>
        );
    }
}

export default NotFound;