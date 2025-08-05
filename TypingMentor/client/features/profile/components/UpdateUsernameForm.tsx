"use client";

import { FormEvent, useState } from "react";
import { profileService } from "../services/profileService";
import { useAuth } from "../../auth/hooks/AuthProvider";
import { TextField } from "../../../components/ui/TextField";
import { Button } from "../../../components/ui/Button";
import { Alert } from "../../../components/ui/Alert";

export function UpdateUsernameForm() {
  const { user, refreshUser } = useAuth();
  const [username, setUsername] = useState(user?.username ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSubmit(event: FormEvent) {
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
