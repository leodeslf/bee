import GitHub from "@auth/sveltekit/providers/github";
import Google from "@auth/sveltekit/providers/google";
import MicrosoftEntraID from "@auth/sveltekit/providers/microsoft-entra-id";

const providers = [
  GitHub,
  Google,
  MicrosoftEntraID,
];

const providersUi = [
  { id: 'google', name: 'Google' },
  { id: 'github', name: 'GitHub' },
  { id: 'microsoft-entra-id', name: 'Microsoft' },
];

export {
  providers,
  providersUi,
};
