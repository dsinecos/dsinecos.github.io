---
layout: post
title:  "SSH - The whole shebang"
categories: blog
---

I've run into setting up SSH keys quite a few times now and I decided to finally sit down and figure out what's happening under the hood - the concepts and the tools.

To get a grasp of what happens during a SSH connection I wrote a blog post [How SSH achieves secure communication](https://dsinecos.github.io/blog/Understanding-SSH). 

In this post I want to understand the different tools involved - for generating SSH keys, for authenticating via SSH keys, SSH server, SSH client, ssh-agent etc - and what role they play in setting up a SSH connection.

### Index
- [Steps in a SSH connection](#steps-in-a-ssh-connection)
- [Authenticating the server](#authenticating-the-server)
    - [How to get the public key for a server for SSH verification?](#how-to-get-the-public-key-for-a-server-for-ssh-verification)
    - [What is the use of `known_hosts` file?](#what-is-the-use-of-knownhosts-file)
    - [How to add the public key for a server to `known_hosts` file for a user?](#how-to-add-the-public-key-for-a-server-to-knownhosts-file-for-a-user)
- [Generating a symmetric encryption key via Diffie Hellman Key Exchange Algorithm](#generating-a-symmetric-encryption-key-via-diffie-hellman-key-exchange-algorithm)
- [Authenticating the client](#authenticating-the-client)
    - [Via username and password](#via-username-and-password)
    - [Via public-private key pair](#via-public-private-key-pair)
        - [What is the use of `authorized_keys` file?](#what-is-the-use-of-authorizedkeys-file)
- [Summary of Tools](#summary-of-tools)

<br>

## Steps in a SSH connection

![ssh-tools](/assets/ssh-tools.svg)

The SSH connection is implemented using the client-server model and involves the following steps

1. Verifying the server (by the client)

2. Creating a shared key for symmetric encryption via Diffie Hellman Key Exchange

3. Authenticating the client (by the server)

<br>

## Authenticating the server

The objective of this step is to ensure we do not connect to an impostor. 

When a SSH connection is attempted, the server verifies itself by presenting its public key. The verification has to be done manually the first time by comparing it to the public key of the server we wish to connect to.

The server will return a SSH Key fingerprint which is the MD5 hash of the Base64-encoded public key of the server. For instance in the following message

```
The authenticity of host 'github.com (192.30.252.129)' can't be established.
RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
Are you sure you want to continue connecting (yes/no)?
```

### How to get the public key for a server for SSH verification?

To get the public key of the server `ssh-keyscan` can be used. To get the public key of 'github.com` run the following command in terminal

`ssh-keyscan -t rsa github.com` 

- `t` Specifies the type of key to be fetched. Possible values are ecdsa, rsa, rsa1 etc. In this command we request for 'rsa' key

Output

`github.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkc
cKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDE
SU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0
eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==`

### What is the use of `known_hosts` file?

Once the public key is verified, it is added in the `known_hosts` file for that user automatically. This file resides in `~/.ssh` folder. When a SSH connection is attempted the second time the public key presented by the server is compared to the keys stored in `known_hosts` and if a match is found, the server is considered verified.

### How to add the public key for a server to `known_hosts` file for a user?

The public key can be added from the terminal using the following command

`ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts`

This will append the public key for 'github.com' to `known_hosts` file.

If the server were to change its public key, it will need to be updated in the `known_hosts` file as well to allow for seamless verification the next time a SSH connection is attempted. 

<br>

## Generating a symmetric encryption key via Diffie Hellman Key Exchange Algorithm

This step is used to generated a shared key that is used to encrypt all further communication between the client and the server

<br>

## Authenticating the client

There are two primary methods for authenticating a client during a SSH connection

### Via username and password

In this method of authentication, the user is prompted for a password. On verification by the server the SSH connection is established.

### Via public-private key pair

#### What is the use of `authorized_keys` file?

For this method of authentication to work, the public key of the client has to be stored on the server in `authorized_keys` file inside `~/.ssh` folder for that user.

Steps during client authentication

1. The client sends an ID for the public-private key pair that it would like to use for authenticating

2. The server checks is `authorized_keys` file for the key ID

3. If the public key is found against the ID, the server uses the public key to encrypt and send a challenge message to the client

4. The client if it possesses the corresponding private key will be able to decrypt the challenge message provided by the server. The client then combines the decrypted message with the symmetric encryption key that was generated via Diffie Hellman key exchange and hashes them using MD5. This hash is then sent to the server

5. The server since it has the original challenge message and the symmetric encryption key can verify the hash. If the two hashes match, the client is authenticated

<br>

## Summary of Tools

- SSH Daemon - Is the SSH server that listens for SSH connections on a specific port and authenticates clients and spawns the appropriate shell for the authenticated user

- SSH Client - Uses the SSH protocol to request a connection with the SSH server

- `ssh-keyscan` - To gather the public ssh key of a server

- `ssh-keygen`
  
  Is used to generate a public-private key pair. It's different options can be used to specify the type of key to be generated.

  **Creating a public-private key pair**

  1. Typing `ssh-keygen` inside the terminal will prompt with the following message
  2. `Enter a file in which to save the key (/home/you/.ssh/id_rsa):` To specify a different file remember to specify the absolute path
  3. Next it prompts for a passphrase `Enter passphrase (empty for no passphrase):` The passphrase is used to encrypt the file that stores the private key
  4. Completing the above steps will result in two files created inside `~/.ssh`
     1. `id_rsa` - Stores the private key
     2. `id_rsa.pub` - Stores the public key

- `ssh-agent`

  Is used to store the private keys. Other programs which initiate a SSH connection and require verification request `ssh-agent` for it. `ssh-agent` authenticates on behalf of the program without sharing the SSH keys with the program

  If the SSH keys have been encrypted with a passphrase, `ssh-agent` will prompt for a passphrase when authenticating the cient on the server

  **How to add SSH keys to `ssh-agent`?**

  1. Start the `ssh-agent` in the background
     `eval "$(ssh-agent -s)"`
  2. Add the private SSH key
     `ssh-add ~/.ssh/id_rsa`



