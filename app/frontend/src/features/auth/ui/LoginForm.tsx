import React, { useState, FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../../../components/atoms/Input";
import { Button } from "../../../components/atoms/Button";

export const LoginForm = () => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!email || !pass) return;

    login({ email, pass });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-sm mx-auto"
    >
      <Input
        label="Email"
        type="email"
        value={email}
        placeholder="user@example.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        value={pass}
        onChange={(e) => setPass(e.target.value)}
      />

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md flex items-center gap-2">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        variant="primary"
        disabled={isLoading || !email || !pass}
        className="w-full mt-2 shadow-md"
      >
        {isLoading ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
};

