import * as dotenv from 'dotenv';
import joi from 'joi';

export function loadConfiguration(path) {
  dotenv.config({
    path,
  });

  const environmentValidationSchema = joi
    .object({
      HTTP_PORT: joi.number().required().min(0).max(65535),
    })
    .unknown(true);

  const { error, value: validatedEnvironmentVariavbles } = environmentValidationSchema.validate(process.env);

  if (error) {
    console.error(`Config validation error: ${error.message}`);
    process.exit(1);
  }

  const config = {
    httpPort: validatedEnvironmentVariavbles.HTTP_PORT,
  };

  return config;
}
