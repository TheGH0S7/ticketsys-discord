const Discord = require('Discord.js');
const client = new Discord.Client();
const cfg = require('./config.json');
const { tictactoe } = require('reconlx')
const mongoose = require('mongoose');
const fs = require('fs');
const Output = require('./database/models/Output')


//Ao iniciar:
mongoose.connect('mongodb://localhost/ticket', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log(' db started in mongodb://localhost/test ' )
});


client.on('ready', () => {
    console.log('ɹ̸̷̸o̸̷̸o̸̷̸ʇ̸̷̸ ɯ̸̷̸ʎ̸̷̸ ɯ̸̷̸ᴉ̸̷̸n̸̷̸d̸̷̸d');
   client.user.setActivity("ɹ̸̷̸o̸̷̸o̸̷̸ʇ̸̷̸ ɯ̸̷̸ʎ̸̷̸ ɯ̸̷̸ᴉ̸̷̸n̸̷̸d̸̷̸", { type: 'COMPETING' });
});

client.on('message', async message => {
    if (message.content === cfg.prefix+'ping') {
        message.channel.send("Pong :ping_pong: **" + `${Math.round(client.ws.ping)}` + "ms**");
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (message.content === cfg.prefix+'ticket') {
    var response = await Output.findOne({
        u_id: message.author.id 
    })

        if(response) return message.channel.send('ticket já foi aberto')
        var catg = await message.guild.channels.create(`ticket-${message.author.username}`, {
        type: 'category',
        position: 1,
        permissionOverwrites: [
            {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL'],
            }]
    })
        var ch = await message.guild.channels.create('chat-ticket', {
            type: 'text',
            parent: catg.id,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL']
                }]
        })
        var vc = await message.guild.channels.create('voice-ticket', {
            type: 'voice',
            parent: catg.id,
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL']
                }
            ]}
        )////////////////
            const outputDocument = await Output.create({
                vc_id: vc.id,
                c_id: catg.id,
                t_id: ch.id,
                date: new Date,
                u_id: message.author.id

            })
            await outputDocument.save()
        }
        if(message.content === cfg.prefix+'close') {
            var response = await Output.findOne({
                t_id: message.channel.id
            })
            if(!response) return;
            if(!message.member.hasPermission('ADMINISTRATOR')) {
                return message.channel.send('apenas `ADMINISTRADORES` podem fechar o ticket')
            }
            var tid = response.t_id
            var cdid = response.c_id
            var vcid = response.vc_id
            var delv = await message.guild.channels.cache.find(v => v.id == vcid)
            var delc = await message.guild.channels.cache.find(c => c.id == cdid)
            delv.delete()
            delc.delete()
            message.channel.delete()
            var response = await Output.deleteOne({
                t_id: message.channel.id
            })
        }
        
});


client.login(cfg.token)