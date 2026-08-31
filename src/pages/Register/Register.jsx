import { Button } from "/src/components/Button";
import { Colors } from "/src/components/Color";
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';
import starShape from '/src/assets/ree.png'; // adjust this relative path to match your folder structure path

export function Register() {
    return (
        <div className="w-full min-h-screen flex justify-center items-center px-4 py-10"
            style={{ background: Colors.background }}
        >
            <div className="relative isolate w-full max-w-xl flex justify-center items-center">
                {/* Background shape — stretches to match form height */}
                <img
                    src={starShape}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-fill z-0 pointer-events-none select-none"
                />

                {/* Form sits on top, its size drives the wrapper's height */}
                <form
                    action=""
                    className="relative z-10 w-[88%] sm:w-[80%] bg-gray-100 my-8 sm:my-12 p-5 sm:p-8 rounded shadow-lg"
                >
                    <h3 className="text-2xl sm:text-4xl text-center font-bold mb-5 sm:mb-7">Register</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                        <div className="form-group mb-3 min-w-0">
                            <label htmlFor="fullname" className="block mb-2 font-bold">Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter fullname"
                                id="fullname"
                                className="border block rounded h-11 sm:h-12 w-full px-3 min-w-0"
                            />
                        </div>
                        <div className="form-group mb-3 min-w-0">
                            <label htmlFor="username" className="block mb-2 font-bold">Username</label>
                            <input
                                type="text"
                                placeholder="Enter username"
                                id="username"
                                className="border block rounded h-11 sm:h-12 w-full px-3 min-w-0"
                            />
                        </div>

                        <div className="form-group mb-3 min-w-0">
                            <label htmlFor="email" className="block mb-2 font-bold">Email</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                id="email"
                                className="border block rounded h-11 sm:h-12 w-full px-3 min-w-0"
                            />
                        </div>
                        <div className="form-group mb-3 min-w-0">
                            <label htmlFor="phone" className="block mb-2 font-bold">Phone Number</label>
                            <input
                                type="text"
                                placeholder="Enter phone"
                                id="phone"
                                className="border block rounded h-11 sm:h-12 w-full px-3 min-w-0"
                            />
                        </div>

                        <div className="form-group mb-3 min-w-0">
                            <label htmlFor="password" className="block mb-2 font-bold">Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                id="password"
                                className="border block w-full rounded h-11 sm:h-12 px-3 min-w-0"
                            />
                        </div>
                        <div className="form-group mb-3 min-w-0">
                            <label htmlFor="re-enter" className="block mb-2 font-bold">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                id="re-enter"
                                className="border block rounded h-11 sm:h-12 w-full px-3 min-w-0"
                            />
                        </div>
                    </div>

                    <div className="form-group mb-5">
                        <p>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-medium"
                                style={{ color: Colors.primary }}
                            >
                                Login
                            </Link>
                            { ' /'}
                            <Link
                                to="/"
                                className="font-medium"
                                style={{ color: Colors.primary }}
                            >
                                Home
                            </Link>
                        </p>
                    </div>
                    <div className="form-group flex justify-center">
                        <Button name="Register" />
                    </div>
                </form>
            </div>
        </div>
    );
}
