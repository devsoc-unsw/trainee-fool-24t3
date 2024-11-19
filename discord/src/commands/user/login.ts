import {
  CommandInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  GuildScheduledEventPrivacyLevel,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("Log into Pyramids using your browser."),

  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: `🔗  **Log in via this link**: https://pyrmds.app/login?discord=${interaction.user.id}`,
      ephemeral: true,
    });
  },
};
