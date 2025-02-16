# 🚀 create-react-edge

Create a new [React Edge](https://www.npmjs.com/package/react-edge) application with one command.

## Quick Start

Using npm:

```bash
npm create react-edge
```

Using npx:

```bash
npx create-react-edge
```

Using yarn:

```bash
yarn create react-edge
```

Follow the prompts to create your project.

## What's included

The project template comes with:

- React 19
- TypeScript
- Tailwind CSS
- Vite
- Vitest
- ESLint + Prettier
- Cloudflare Workers integration

## Requirements

- Node.js 18+
- npm 7+

## Cloudflare Configuration

To use Cloudflare Workers, you'll need to provide your Cloudflare credentials. You can do this in two ways:

1. Add it to your package.json scripts:

```json
{
	"scripts": {
		"edge": "CLOUDFLARE_API_TOKEN=[CF_API_TOKEN] edge"
	}
}
```

2. Set environment variables:

```bash
export CLOUDFLARE_API_TOKEN=[USER_CF_API_TOKEN]
```

Replace `[USER_CF_API_TOKEN]` with your actual Cloudflare Account ID and API Token.

## 📝 License

MIT © [Felipe Rohde](mailto:feliperohdee@gmail.com)

## 👨‍💻 Author

**Felipe Rohde**

- Twitter: [@felipe_rohde](https://twitter.com/felipe_rohde)
- Github: [@feliperohdee](https://github.com/feliperohdee)
- Email: feliperohdee@gmail.com
