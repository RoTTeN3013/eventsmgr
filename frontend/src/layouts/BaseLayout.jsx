import { Head, Link } from '@inertiajs/react';
import Navigation from '../components/Navigation';

export default function BaseLayout({ children }) {

    return (
        <>
            <Navigation />
                <main>
                    {children}
                </main>
        </>
    );
}
