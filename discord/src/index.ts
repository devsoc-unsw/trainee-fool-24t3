import { REST, Routes } from 'discord.js';

const { BOT_TOKEN, CLIENT_ID } = process.env;

if (!BOT_TOKEN || !CLIENT_ID) {
  throw new Error(
    'BOT_TOKEN and CLIENT_ID must be defined in a supplied .env file.'
  );
}

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
