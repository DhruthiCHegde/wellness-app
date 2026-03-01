import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-8 font-sans">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-2xl w-full text-center shadow-2xl">
                        <h1 className="text-3xl font-black text-emerald-400 mb-4 tracking-tight">Something went wrong.</h1>
                        <p className="text-zinc-400 mb-6">Our wellbeing platform encountered an unexpected error. Please try resetting the page.</p>
                        <div className="bg-zinc-950 p-4 rounded-xl text-left overflow-auto text-sm text-red-400 font-mono mb-6 max-h-48 border border-zinc-800">
                            {this.state.error?.toString()}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-colors shadow-lg"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
