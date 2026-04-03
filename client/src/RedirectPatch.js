// src/RedirectPatch.js
import React from "react";
import { Navigate } from "react-router-dom";

export const Redirect = ({ to, push = false }) => <Navigate to={to} replace={!push} />;
