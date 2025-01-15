# Alloy Configuration

This directory contains the configuration for Grafana Alloy.

## Setup

1. Create a `.env` file in the root directory:
```bash
cp ../.env.template ../.env
```

2. Edit the `.env` file with your actual credentials:
```env
GRAFANA_USERNAME=your_actual_username
GRAFANA_PASSWORD=your_actual_password
```

3. Copy the template configuration file:
```bash
cp config.alloy.template config.alloy
```

The `config.alloy` file will automatically read the credentials from your environment variables.

## Security Notes

- Never commit the `.env` file as it contains sensitive information
- The `.env` file is already added to `.gitignore`
- Only share the `.env.template` file, which contains placeholder values
