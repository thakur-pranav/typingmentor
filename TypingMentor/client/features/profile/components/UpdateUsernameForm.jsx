"use client";

import { useState } from "react";
import { profileService } from "../services/profileService.js";
import { useAuth } from "../../auth/hooks/AuthProvider.jsx";
import { TextField } from "../../../components/ui/TextField.jsx";
import { Button } from "../../../components/ui/Button.jsx";
import { Alert } from "../../../components/ui/Alert.jsx";

export function UpdateUsernameForm() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("saving");
    try {
      await profileService.updateUsername(username);
      await refreshUser();
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "saved" && <Alert variant="success">Username updated.</Alert>}
      {status === "error" && <Alert variant="error">Could not update username.</Alert>}
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        minLength={3}
        maxLength={30}
      />
      <Button type="submit" isLoading={status === "saving"}>
        Save changes
      </Button>
    </form>
  );
}
