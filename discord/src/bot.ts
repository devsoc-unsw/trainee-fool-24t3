import {
  Client,
  GatewayIntentBits,
  GuildScheduledEvent,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
} from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN must be defined in a supplied .env file.');
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }

  if (interaction.commandName === 'newevent') {
    await interaction.reply('Creating new event...');

    const manager = interaction.guild
      ?.scheduledEvents as GuildScheduledEventManager;
    const event = await manager.create({
      name: 'My Event',
      channel: interaction.channelId,
      entityMetadata: {
        location: 'Somewhere in the world',
      },
      scheduledStartTime: new Date(2025, 10, 3),
      scheduledEndTime: new Date(2025, 10, 6),
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: 'My description',
    });
    interaction.editReply(`Created event ${event.id}`);
  }
});

client.login(BOT_TOKEN);
