import { SubmitButton } from "../button/SubmitButton.js";

export function Logout() {
  return (
    <form action='/logout' method='POST'>
      <SubmitButton>Logout</SubmitButton>
    </form>
  );
}
