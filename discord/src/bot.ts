import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import commands from './commands/commands.js';
const { BOT_TOKEN, APPLICATION_ID } = process.env;

if (!BOT_TOKEN || !APPLICATION_ID) {
  throw new Error(
    'BOT_TOKEN and APPLICATION_ID must be defined.\nConsider defining them in a supplied .env file.'
  );
}

/*
    Initialise client and set commands
*/

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
for (const command of commands) {
  client.commands.set(command.data.name, command);
}

/*
    Command handling
*/

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  }
});

client.login(BOT_TOKEN);
