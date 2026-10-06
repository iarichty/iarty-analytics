import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    /** Optional custom fallback UI. */
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

/**
 * Catches render-time errors so a single failure shows a friendly message
 * instead of a blank white screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Surface the error for debugging; a real app would forward this to a
        // monitoring service.
        console.error('Unhandled UI error:', error, info.componentStack);
    }

    private handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
                    <h1 className="mb-3 text-3xl font-black">Something went wrong</h1>
                    <p className="mb-8 max-w-md text-slate-500 dark:text-slate-400">
                        An unexpected error occurred while rendering this page. Your data
                        never left your browser.
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white transition-colors hover:bg-purple-700"
                    >
                        Reload page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
