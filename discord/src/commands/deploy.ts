import {
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';
import commands from './commands.js';
const { BOT_TOKEN, APPLICATION_ID, SERVER_ID } = process.env;

if (!BOT_TOKEN || !APPLICATION_ID) {
  throw new Error(
    'BOT_TOKEN and APPLICATION_ID must be defined in a supplied .env file.'
  );
}

const commands_data: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
for (const command of commands) {
  commands_data.push(command.data.toJSON());
}

const rest = new REST().setToken(BOT_TOKEN);

const deploy = async (mode: string) => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    let data: any;
    if (mode === 'test' && SERVER_ID) {
      data = await rest.put(
        Routes.applicationGuildCommands(APPLICATION_ID, SERVER_ID),
        { body: commands_data }
      );
    } else {
      data = await rest.put(Routes.applicationCommands(APPLICATION_ID), {
        body: commands_data,
      });
    }

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    console.error(error);
  }
};

const args = process.argv.slice(2);
if (args.length !== 1 || (args[0] !== 'test' && args[0] !== 'public')) {
  console.error('Usage: pnpm run cmds test|public');
} else {
  if (args[0] === 'test' && !SERVER_ID) {
    console.error(
      'SERVER_ID must be defined in a supplied .env file for test mode.'
    );
  } else {
    deploy(args[0]);
  }
}
