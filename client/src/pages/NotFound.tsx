import { Link } from "wouter";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <h1 className="text-8xl font-bold text-primary">404</h1>
                <h2 className="text-2xl text-foreground">Stranica nije pronađena</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Stranica koju tražite ne postoji ili je premještena.
                </p>
                <Link href="/">
                    <a className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Povratak na naslovnicu
                    </a>
                </Link>
            </div>
        </div>
    );
}
