import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../firebase";
import { useAuth } from "../../../context/AuthContext";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

const Signup = () => {
  const { signUp, getUserUid } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    email: "",
    password: "",
    createdAt: serverTimestamp(),
    loading: false,
  });

  // collection references
  const learnersRef = collection(db, "learners_data");
  const userType = collection(db, "user_type");
  const userState = collection(db, "user_state");

  const handleChange = (e) => {
    setSignupFormData({ ...signupFormData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupFormData({ ...signupFormData, loading: true });

    if (
      !signupFormData.name ||
      !signupFormData.email ||
      !signupFormData.password
    ) {
      console.log("All fields are required");
    }

    try {
      await signUp(signupFormData.email, signupFormData.password);

      const newLearnerData = {
        uid: getUserUid(),
        name: signupFormData.name,
        email: signupFormData.email,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(learnersRef, getUserUid()), newLearnerData);
      await setDoc(doc(userType, getUserUid()), {
        type: "learner",
      });
      await setDoc(doc(userState, getUserUid()), {
        isOnline: true,
      });

      console.log("Signed up in successfully");
      navigate("/sidebar");
    } catch (error) {
      console.error("Error adding learner data: ", error);
    }
    setSignupFormData({
      name: "",
      email: "",
      password: "",
      loading: false,
    });
  };

  return (
    <div className="w-full flex flex-col items-center ">
      <div className=" flex flex-col items-center">
        <p className="text-4xl font-semibold my-4">
          Begin your learning journey today!
        </p>
        <form className="w-full flex flex-col" onSubmit={handleSubmit}>
          <div className="space-y-3 mb-10">
            <label className="flex flex-col font-medium text-lg">
              Name
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="py-3 pl-5 w-full border border-black rounded-md"
                onChange={(e) => handleChange(e)}
              />
            </label>
            <label className="flex flex-col font-medium text-lg">
              Email
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="py-3 pl-5 w-full border border-black rounded-md"
                onChange={(e) => handleChange(e)}
              />
            </label>
            <label className="flex flex-col font-medium text-lg">
              Password
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="py-3 pl-5 w-full border border-black rounded-md"
                onChange={(e) => handleChange(e)}
              />
            </label>
          </div>

          <button
            type="submit"
            className="py-3 w-full font-bold bg-[#0968B1] text-white border border-black rounded-md"
            disabled={loading}
          >
            {loading ? <p>Loading...</p> : <p>Sign up</p>}
          </button>
        </form>
        <p className="font-medium my-3">Or</p>
        <button className="py-2 w-full font-bold border border-black rounded-md">
          Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Signup;
