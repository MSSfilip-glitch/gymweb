import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="min-h-screen flex items-center justify-center bg-background">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold text-destructive">Greška</h1>
                            <p className="text-muted-foreground">Nešto je pošlo po krivu. Molimo osvježite stranicu.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
                            >
                                Osvježi
                            </button>
                        </div>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
