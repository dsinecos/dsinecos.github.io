---
layout: post
title:  "How SSH achieves secure communication?"
categories: blog
---

I wanted to demystify SSH and went through a few lectures from this course [The Complete Junior to Senior Web Developer Roadmap](https://www.udemy.com/the-complete-junior-to-senior-web-developer-roadmap/) covering SSH.

The following is a summary of my present understanding of how SSH secures communication between two machines 

![setting-up-an-ssh-connection](/assets/setting-up-an-ssh-connection.svg)

<br>

## Asymmetric Encryption

Asymmetric encryption uses two different keys for encryption and decryption. The pair of keys is called as Public-Private key pair. A message encrypted using the public key can only be decrypted by the corresponding private key

SSH uses asymmetric encryption to achieve key exchange and post that it uses symmetric encryption to encrypt messages being exchanged. As asymmetric encryption is slower than symmetric it is only used to achieve key exchange. The following communication is encrypted using Symmetric encryption

<br>

## Symmetric Encryption

Uses one secret key for encryption and decryption and anyone with access to the key can decrypt the message being sent

<br>

## Hashing

To check against tampering of messages in transit a hash of the message, the secret key and packet sequence id is sent as well. The other party on receiving the message can generate its own hash and check to match against the hash provided.

<br>

## Authentication

To ascertain the identity of the client, a public-private key pair is used.

To verify the identity of the client the server uses the client's public key to generate a challenge and sends it to the client. If the client can successfully decrypt the message it implies that the client holds the corresponding private key and is authenticated

<br>

# References
- [MiTM vulnerability of Difiie Hellman Key Exchange algorithm](https://crypto.stackexchange.com/a/26671)
- [Countering MiTM vulnerability of Difiie Hellman Key Exchange algorithm](https://security.stackexchange.com/a/40617)


