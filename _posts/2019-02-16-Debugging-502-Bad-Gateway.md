---
layout: post
title:  "Debugging 502 - Bad Gateway OR How to not get locked out of iCloud account if you use Linux?"
categories: blog
---

I think I spotted a bug in iCloud and I'm writing this post to summarize an unexpected and amusing experience I had discovering and debugging it.

- [Context](#context)
- [Problem](#problem)
- [Debugging](#debugging)
  - [Is it just me or?](#is-it-just-me-or)
  - [Can Customer Support help?](#can-customer-support-help)
  - [Let's Try and Error](#lets-try-and-error)
  - [Can the client's OS cause a '502 - Bad Gateway' error?](#can-the-clients-os-cause-a-502---bad-gateway-error)
- [Conclusion](#conclusion)

<br>

## Context

I've been applying for jobs the last few months and on a friend's suggestion I decided to prepare my resume in iCloud - Pages. I wasn't sure I'd be able to create an account considering I use no Apple devices but to my pleasant surprise I was able to. 

![use-icloud](/assets/use-icloud.png)

My experience using Pages was smooth and I decided to stick to it.

I however made the mistake of having only Pdf copies of my resume on my machine and assumed if I needed to make edits, I could always access them online.

Also while logging into the iCloud account, Firefox did not offer the prompt to remember the password and so I've had to reset passwords a couple of times when I can't recall.

<br>

## Problem

I was in conversation with a lead for a freelance project and they asked me to send across my resume. Since I had to make a few edits I needed access to the iCloud account.

I had forgot my password and unfortunately this time around the 'Reset Password' link returned a '502 - Bad Gateway' error. I assumed there must be some fault on the server side and given that it's an Apple service things would be up and running in no time. 

![bad-gateway](/assets/bad-gateway.png)

I used Libre to open the pdf document and after a tedious hour had edited the resume to send it across. The grind of editing a Pdf on Libre office helped embed that I should have kept a copy on my machine.

<br>

## Debugging

I had hoped the '502 - Bad Gateway' would disappear in a few days I would reset my password and be on my merry way. I checked again in about a week and then again a week later only to receive the same error. I considered there might be a problem at my end though I had no clue what it could be.

### Is it just me or?

I had another friend try and reset the password from his computer and he received the same error. 

This was confusing because I'm in India and he's in Europe and I thought if Apple's password reset service was malfunctioning at this scale they'd certainly be working on it. 

I checked the service on https://www.isitdownrightnow.com which displayed the Password reset service as reachable.

### Can Customer Support help?

I then contacted Apple Support and the support person asked me if I could share my screen. She directed me to this page 'https://ara-prn.apple.com/' which says 'Supported operating systems are macOS 10.6 and later or Windows 7 and later'

![screen-share](/assets/screen-share.png)

Since I use Ubuntu, I could not share my screen. I asked the support person to check if they were able to access https://iforgot.apple.com which returned 502 - Bad Gateway for me. She confirmed that she was able to access and I decided to have another friend try out the Password reset screen, only this time the friend uses a Mac and not Linux. 

### Let's Try and Error

I thanked the support person for her help and dialled up my friend, who uses a Mac, and was able to access the Password reset page.

I figured I'd reset my password using his Mac and move on. I was however curious to understand how the OS on my machine results in a '502 - Bad Gateway' error for an HTTP request.

### Can the client's OS cause a '502 - Bad Gateway' error?

For no convincing reason I resent the request after removing the User-Agent as Linux and I was able to access the 'Reset Password' page for iCloud.

<br>

## Conclusion

For a while I was upset about the episode, having to solve a puzzle to use a critical service such as resetting a password, but I can't help being amused right now. 

I guess I just never expected such an experience to result from an Apple Product and I can't figure out how doing this helps them in any way. I hope it's a bug and not an intentional design.

For myself I hope I remember to keep an editable copy of my resume on my machine because I haven't yet :D