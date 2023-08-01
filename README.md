# Aleo Starting Boilerplace

This includes boilerplate code to allow anyone to create and test Aleo programs. The boilerplate has been used from the [zk-gaming-toolkit](https://github.com/kryha/zk-gaming-toolkit).

## Adding your own program

1. Create your new program at [contracts folder/](/contracts). You can use `leo new program_name` to create a program.
2. Add your `program_name` to [programNames](/src/constants.ts/#L35)
3. Create a new file and add different types that your program might need at [types](src/types). Create two types for each object; one to be used with TS/JS, and other type to be used with Leo.
4. Add the conversion logic (Leo -> JS/TS) at [util](src/services/leo/util.ts/#67).
5. Add the conversion logic (JS/TS -> Leo) at [leo-parsers](src/utils/leo-parsers.ts/#58).
6. Create a new file at [services](/src/services/leo/) with your `program_name` to support different transitions that is used in your program. Make use of types (Step 3) and conversions (Step 4 & 5). Add the newly created file to [index](/src/services/leo/index.ts).
7. Create a `your_program.test.ts` file to easily test your newly created program.

## Getting Started

There are 2 main ways to run the API: locally or inside an isolated Minikube container. To learn more about running Minikube container look [here](https://github.com/kryha/zk-gaming-toolkit#running-with-minikube)

### Running locally

Before running the API locally, make sure to install the following software:

- [Node.js](https://nodejs.org/en) version 18.16.0 LTS
- [Yarn](https://yarnpkg.com/getting-started/install)
- [Aleo](https://github.com/AleoHQ/aleo#2-build-guide)
- [Leo](https://github.com/AleoHQ/leo#2-build-guide)
- [SnarkOS](https://github.com/AleoHQ/snarkOS#22-installation)
- Aleo development server - run `cargo install aleo-development-server`

Run a local SnarkOS beacon node:

```sh
snarkos start --nodisplay --dev 0 --beacon "APrivateKey1zkp8CZNn3yeCseEtxuVPbDCwSyhGW6yZKUYKfgXmcpoGPWH"
```

> ⚠️ Do not change the private key, since the app is configured to use that in develop.

Open another terminal window and run Aleo development server:

```sh
aleo-develop start -p http://127.0.0.1:3030
```

> ⚠️ Make sure to specify that local address. If no address is specified, the dev server will connect to the public testnet and you usually don't want that when developing.

Build all the programs locally by running:

```bash
./build_local_programs.sh
```

The first time you run the API, make sure to deploy the programs as well:

```sh
DEPLOY_PROGRAMS=true DEPLOY_PRIVATE_KEY=APrivateKey1zkp8CZNn3yeCseEtxuVPbDCwSyhGW6yZKUYKfgXmcpoGPWH yarn start
```

Pay very close attention to the application and development server logs.

After all the programs have been deployed to the network, the API should be accessible at <http://localhost:5001>

Unless you reset the network, you don't need to re-deploy the programs, so the following time you want to run the API locally, just run:

```bash
yarn start
```

If you wish to reset your network, stop the beacon process and then run:

```sh
snarkos clean --dev 0
```

> ⚠️ After you reset the local network, you will have to re-deploy your programs.




### Testing your program
There are two three modes to . 
