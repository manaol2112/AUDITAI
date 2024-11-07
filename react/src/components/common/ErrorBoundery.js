import React from 'react';

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <p>Something went wrong.</p>;
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
