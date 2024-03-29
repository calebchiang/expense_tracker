import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const signupEndpoint = 'http://localhost:3000/api/auth/signup';
        const loginEndpoint = 'http://localhost:3000/api/auth/login';

        try {
            // Attempt to sign up
            const signupResponse = await fetch(signupEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDetails),
            });

            const signupData = await signupResponse.json();

            if (!signupResponse.ok) {
                console.error('Signup failed:', signupData.message);
            } else {
                console.log('Signup successful:', signupData.message);

                const loginResponse = await fetch(loginEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: userDetails.email,
                        password: userDetails.password,
                    }),
                });

                const loginData = await loginResponse.json();

                if (!loginResponse.ok) {
                    console.error('Login failed:', loginData.message);
                } else {
                    localStorage.setItem('token', loginData.token);
                    console.log('Logged in successfully, token stored.');
                    navigate('/dashboard');
                }
            }
        } catch (error) {
            console.error('Error during sign-up or login:', error);
        }
    };


    return (
        <main className="mx-auto flex min-h-screen w-full items-center justify-center bg-gray-900 text-white">
            <form className="flex w-[30rem] flex-col space-y-10" onSubmit={handleSubmit}>
                <div className="text-center text-4xl font-medium">Sign Up</div>

                <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                        value={userDetails.username}
                        onChange={handleChange}
                    />
                </div>

                <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                        value={userDetails.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="w-full transform border-b-2 bg-transparent text-lg duration-300 focus-within:border-indigo-500">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border-none bg-transparent outline-none placeholder:italic focus:outline-none"
                        value={userDetails.password}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="transform rounded-sm bg-indigo-600 py-2 font-bold duration-300 hover:bg-indigo-400">
                    SIGN UP
                </button>

                <p className="text-center text-lg">
                    Already have an account?
                    <Link to="/login" className="font-medium text-indigo-500 underline-offset-4 hover:underline">Log In</Link>
                </p>
            </form>
        </main>
    );
}

export default SignUp;
