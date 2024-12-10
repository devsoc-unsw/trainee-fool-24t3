import { SettingsPage } from '../SettingsPage';

export function DiscordPage() {
  return (
    <SettingsPage title="Discord integration" headerButtons={[]}>
      <a
        target="_blank"
        href="https://discord.com/oauth2/authorize?client_id=1301423026633445447&permissions=17600776112128&integration_type=0&scope=applications.commands+bot"
      >
        Invite the bot!
      </a>{' '}
      <span>🌞</span>
    </SettingsPage>
  );
}
