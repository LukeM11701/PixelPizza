const{createEmbed,hasRole,sendEmbed}=require("../functions");
const{blue,red}=require('../colors.json');
const{deliverer}=require('../roles.json');

module.exports={
    name:"deliverset",
    description:"set your delivery message",
    aliases:["delset"],
    args:false,
    cooldown:30,
    userType:"worker",
    neededPerms:[],
    pponly:false,
    execute(message,args,client){
        let embedMsg=createEmbed(blue,"Set delivery message",null,null,"please tell me your delivery message now");
        const deliverRole=client.guild.roles.cache.get(deliverer);
        if(!hasRole(client.member,deliverer)){
            embedMsg.setColor(red).setDescription(`You need to have the ${deliverRole.name} role to be able to set your delivery message!`);
            return sendEmbed(embedMsg,message);
        }
        embedMsg.addField("**Note**","Do not forget to use *{chef}*, *{customer}*, *{image}* and *{invite}* so we will replace them with it!");
        sendEmbed(embedMsg,message).then(() => {
            const filter=m=>m.author===message.author;
            const collector=message.channel.createMessageCollector(filter,{max:1});
            collector.on('collect',m=>{
                const embedMsgError=createEmbed(red,"Set delivery message",null,null,"This delivery message does not contain {chef}, {customer}, {image} or {invite}! please try again!");
                const chefAmount=(m.content.match(/{chef}/g)||[]).length;
                const imageAmount=(m.content.match(/{image}/g)||[]).length;
                const inviteAmount=(m.content.match(/{invite}/g)||[]).length;
                const customerAmount=(m.content.match(/{customer}/g)||[]).length;
                if(!chefAmount||!imageAmount||!inviteAmount||!customerAmount){
                    return sendEmbed(embedMsg,message);
                }
                if(chefAmount>2){
                    embedMsgError.setDescription(`You can use {chef} 1 or 2 times`);
                    return sendEmbed(embedMsgError,message);
                }
                if(imageAmount>1||inviteAmount>1||customerAmount>1){
                    embedMsgError.setDescription(`You can use {customer}, {image} and {invite} 1 time! please try again!`);
                    return sendEmbed(embedMsgError,message);
                }
                query(`UPDATE worker SET deliveryMessage = ? WHERE workerId = ?`,[m.content,m.author.id]);
                embedMsg.setDescription("You have succesfully set your new delivery message!");
                sendEmbed(embedMsg,message);
            });
        });
    }
}