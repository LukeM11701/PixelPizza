const{WebhookClient,MessageEmbed}=require('discord.js');
const{botGuild,prefix,noiceboardMinValue}=require('./config.json');
const{voice,text}=require("./channels.json");
const{log}=require('./webhooks.json');
const{noice2}=require('./emojis.json');
const{noiceboard}=require('./colors.json');

exports.updateMemberSize=(client)=>{const guild=client.guilds.cache.get(botGuild);const allMembersChannel=client.channels.cache.get(voice.allMembers);const membersChannel=client.channels.cache.get(voice.members);const botsChannel=client.channels.cache.get(voice.bots);const members=guild.members.cache.filter(member=>!member.user.bot).size;allMembersChannel.setName(`All members: ${guild.memberCount}`);membersChannel.setName(`Members: ${members}`);botsChannel.setName(`Bots: ${guild.memberCount - members}`);}

exports.updateGuildAmount=(client)=>{const suffixes=["k","m","b"];const activities=["PLAYING","STREAMING","LISTENING","WATCHING"];const activity=activities[Math.floor(Math.random()*activities.length)];const url="http://twitch.tv/";let serverAmout=client.guilds.cache.array().length;let suffixUsed="";for(let suffix in suffixes){if (serverAmout>1000){serverAmout/=1000;suffixUsed=suffix;} else break;}serverAmout=`${serverAmout}${suffixUsed}`;if (activity=="PLAYING"||activity=="STREAMING"){serverAmout=`with ${serverAmout}`;}client.user.setActivity(`${serverAmout} guilds | ${prefix}help`,{type:activity,url:url});}

exports.sendGuildLog=(name,avatar,message)=>{const webhook=new WebhookClient(log.id,log.token);webhook.edit({name:name,avatar:avatar}).then(()=>{webhook.send(message);});}

exports.createEmbed=(color=null,title=null,url=null,author=null,description=null,thumbnail=null,fields=[],image=null,timestamp=false,footer=null)=>{const embedMsg=new MessageEmbed();if(color)embedMsg.setColor(color);if(title)embedMsg.setTitle(title);if(url)embedMsg.setURL(url);if(author&&author.name){if(author.icon&&author.url){embedMsg.setAuthor(author.name,author.icon,author.url);}else if(author.icon&&!author.url){embedMsg.setAuthor(author.name,author.icon);}else if(!author.icon&&author.url){embedMsg.setAuthor(author.name,null,author.url);}else{embedMsg.setAuthor(author.name);}}if(description)embedMsg.setDescription(description);if(thumbnail)embedMsg.setThumbnail(thumbnail);if(fields.length){for(let index in fields){let field=fields[index];if(field.inline){embedMsg.addField(field.name,field.value,true);}else{embedMsg.addField(field.name,field.value);}}}if(image)embedMsg.setImage(image);if(timestamp)embedMsg.setTimestamp();if(footer&&footer.text){if(footer.icon){embedMsg.setFooter(footer.text,footer.icon);}else{embedMsg.setFooter(footer.text);}}return embedMsg;}

exports.checkNoiceBoard=(messageReaction)=>{const guild=messageReaction.message.guild;const member=messageReaction.message.member;const channel=guild.channels.cache.get(text.noiceboard);const emoji=guild.emojis.cache.get(noice2);const embedMsg=this.createEmbed(noiceboard,null,null,{name:member.displayName,icon:member.user.displayAvatarURL()},messageReaction.message.content,null,[{name:"Message",value:`[Jump to message](${messageReaction.message.url})`}],null,true,{text:messageReaction.message.id});const message=channel.messages.cache.find(m=>m.embeds[0].footer.text===messageReaction.message.id);if(messageReaction.count>=noiceboardMinValue){const messageText=`${emoji} ${messageReaction.count} ${messageReaction.message.channel}`;if (!message){return channel.send(messageText,embedMsg);}message.edit(messageText,embedMsg);}else{if(!message)return;message.delete();}}

exports.sendEmbed=(embed,message)=>{if(!message.client.canSendEmbeds)embed=embed.description;message.channel.send(embed);}

exports.addRole=(member,role)=>member.roles.add(role);

exports.removeRole=(member,role)=>member.roles.remove(role);

exports.hasRole=(member,role)=>{return member.roles.cache.get(role);}