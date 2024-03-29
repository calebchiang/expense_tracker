import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Endpoint for your login API
        const loginEndpoint = 'http://localhost:3000/api/auth/login';

        try {
            // Send login request
            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Login failed:', data.message);
            } else {
                localStorage.setItem('token', data.token);
                console.log('Logged in successfully, token stored.');
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };


    return (
        <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
            <form className="flex w-[30rem] flex-col space-y-10" onSubmit={handleSubmit}>
                <div className="text-center text-4xl font-medium">Log In</div>

                <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                        value={credentials.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                        value={credentials.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400">
                    LOG IN
                </button>


                <p className="text-center text-lg">
                    No account?
                    <Link to="/signup" className="font-medium text-indigo-500 underline-offset-4 hover:underline">Create One</Link>
                </p>
            </form>
        </main>
    );
}

export default Login;
