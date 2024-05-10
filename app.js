var txnId = require('./txnId');
const fs = require("fs")

const ADMINS = []
const DB_URL = ''
const BOT_TOKEN = ""

const set_chat = "-"
const set_userbot = "-"
const set_payment = "-"
const set_admin = "-"
const set_money = "-"
const set_wallet = "-"

const set_op_1 = "-"
const set_op_2 = "-"
const set_op_3 = "-"
const set_op_4 = "-"
const set_op_5 = "-"
var SponsorArray = [];

oplata = 3000000

process.env.TZ = 'Moscow/Europe';


const mongo = require('mongoose');
mongo.connect(DB_URL);


var User = mongo.model('User', {
    id: Number,
    name: String,
    outbalance: Number,
    set_withdraw: Number,
    set_ref: Number,
    set_chat: String,
    set_userbot: String,
    set_payment: String,
    set_admin: String,
    set_money: String,
    set_wallet: String,
    set_op_1: String,
    set_op_2: String,
    set_op_3: String,
    set_op_4: String,
    set_op_5: String,
    set_money_message: String,
    fc: Number,
    ref: Number,
    regDate: String,
    fetuses: Number,
    menu: String,
    statusklik: String,
    ban: Boolean,
    refCount: Number,
    not: Boolean,
    data: String,
    spinsToday: Number,
    klik: Number,
    check: Boolean,
    payout: Number,
    checkrefstatus: Boolean,
    bonuscount: Number,
});

const Config = mongo.model("configs", { parameter: String, value: Number, description: String })

var Task = mongo.model('Task', {
    id: Number
});

const Ticket = mongo.model('Ticket', {
    id: Number,
    amount: Number,
    wallet: String
});

const Voucher = mongo.model("Voucher", { id: String, tree_id: Number })

function generateID(res) { var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for (var i = 0; i < res; i++) text += possible.charAt(Math.floor(Math.random() * possible.length)); return text }

const Start = [
    ["💜 Заработать", "💼 Профиль"],
    ["📊 Информация"],
];

const Cancel = [
    ["◀️ Назад"]
];

const TAPI_admin = {
    inline_keyboard: [
        [{ text: "💜 Рассылка", callback_data: "admin_mm" }, { text: "📊 Топ за 24 часа", callback_data: "admin_top" }],
        [{ text: "🖇 Управление", callback_data: "admin_u" }, { text: "💸 Выплаты", callback_data: "admin_w" }],
        [{ text: "⚙️ Настройки", callback_data: "setings" }],
    ]
};

const TAPI_admin_return = {
    inline_keyboard: [
        [{ text: "◀️ Назад", callback_data: "admin_return" }],
    ]
};

const RM_mm1 = {
    inline_keyboard: [
        [{ text: "⏹ Стоп", callback_data: "admin_mm_stop" }],
        [{ text: "⏸ Пауза", callback_data: "admin_mm_pause" }],
    ]
};

const RM_mm2 = {
    inline_keyboard: [
        [{ text: "⏹ Стоп", callback_data: "admin_mm_stop" }],
        [{ text: "▶️ Продолжить", callback_data: "admin_mm_play" }],
    ]
};

const Telegram = require('node-telegram-bot-api');
const bot = new Telegram(BOT_TOKEN, { polling: true });

bot.getMe().then(r => console.log(r));

bot.on('text', async(message) => {
            message.send = (text, params) => bot.sendMessage(message.chat.id, text, params);
            let $menu = [];
            var uid = message.from.id;
            var text = message.text;
            let dt = new Date
            console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + uid + " отправил: " + text);

            if (dt.getDate() == oplata) return message.send('⛔ Вы не оплатили хостинг!\n🚀 Бот создан с помощью @Seba_Setka!!');

            if (message.text) {
                if (message.text.startsWith('/start') || message.text == '🔙 Назад') {
                    let $user = await User.findOne({ id: message.from.id });
                    if (!$user) {
                        let schema = {
                            id: message.from.id,
                            name: message.from.first_name,
                            outbalance: 0,
                            set_withdraw: 0,
                            set_ref: 0,
                            ref: 0,
                            set_chat: "",
                            set_userbot: "",
                            set_admin: "",
                            set_payment: "",
                            set_money: "",
                            set_money_message: "",
                            set_wallet: "",
                            set_op_1: "",
                            set_op_2: "",
                            set_op_3: "",
                            set_op_4: "",
                            set_op_5: "",
                            ban: false,
                            not: false,
                            checkrefstatus: true,
                            check: true,
                            regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
                            menu: "",
                            statusklik: "",
                            data: "",
                            refCount: 0,
                            fc: 0,
                            payout: 0,
                            spinsToday: 0,
                            klik: 0,
                            bonuscount: 0,
                        };

                        let reffer = Number(message.text.split('/start')[1]);

                        if (reffer) {
                            let $reffer = await User.findOne({ id: reffer })
                            if ($reffer) {
                                schema.ref = $reffer.id
                                await $reffer.inc('outbalance', 0)
                                await $reffer.inc('refCount', 0)
                                bot.sendMessage($reffer.id, `<b></b>`, { parse_mode: "HTML" });
                            }
                        }

                        let user = new User(schema);
                        await user.save();
                    }


                    return message.send(`👋 Добро пожаловать!`, {
                        parse_mode: "HTML",
                        reply_markup: {
                            keyboard: Start,
                            resize_keyboard: true
                        }
                    });
                }
            }

            message.user = await User.findOne({ id: message.from.id });
            if (!message.user) return message.send(`😱 Бот был обновлëн!\n📝 Напишите /start чтобы бот заработал!`);
            if (message.user.ban) return
            if (!message.user.name || message.user.name != message.from.first_name)
                await User.findOneAndUpdate({ id: message.from.id }, { name: message.from.first_name })

            if (state[uid] == 99 && ADMINS.indexOf(message.from.id) !== -1 && text != "0") {
                state[uid] = undefined
                bot.sendMessage(uid, "🚀 Рассылка в вашем боте запущена!").then((e) => {
                    if (text.split("#").length == 4) {
                        var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                        var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
                        text = text.split("#")[0]
                        mm_t(text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)
                    } else mm_t(text, e.message_id, e.chat.id, false, false, false, 100)
                })
            }

            var set_op_1 = (await User.findOne({ id: 0 })).set_op_1
            var set_op_2 = (await User.findOne({ id: 0 })).set_op_2
            var set_op_3 = (await User.findOne({ id: 0 })).set_op_3
            var set_op_4 = (await User.findOne({ id: 0 })).set_op_4
            var set_op_5 = (await User.findOne({ id: 0 })).set_op_5
            var buttonsArray = [
                [{ text: "🏪 Магазин ботов", url: "" }],
            ];
            if (set_op_1 && set_op_1.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_1}` }]);
            }
            if (set_op_2 && set_op_2.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_2}` }]);
            }
            if (set_op_3 && set_op_3.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_3}` }]);
            }
            if (set_op_4 && set_op_4.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_4}` }]);
            }
            if (set_op_5 && set_op_5.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_5}` }]);
            }
            if (true) {
                buttonsArray.push([{ text: "🔄 Проверить", callback_data: "checkch" }]);
            }
            if (message.user.check) {
                return bot.sendMessage(message.chat.id, `🔒 <b>Вы не подписаны на наши каналы!</b>`, {
                    parse_mode: "html",
                    reply_markup: {
                        inline_keyboard: buttonsArray
                    }
                });
            }
            var set_op_1 = (await User.findOne({ id: 0 })).set_op_1
            var set_op_2 = (await User.findOne({ id: 0 })).set_op_2
            var set_op_3 = (await User.findOne({ id: 0 })).set_op_3
            var set_op_4 = (await User.findOne({ id: 0 })).set_op_4
            var set_op_5 = (await User.findOne({ id: 0 })).set_op_5
            var buttonsArray = [
                [{ text: "🏪 Магазин ботов", url: "" }],
            ];
            if (set_op_1 && set_op_1.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_1}` }]);
            }
            if (set_op_2 && set_op_2.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_2}` }]);
            }
            if (set_op_3 && set_op_3.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_3}` }]);
            }
            if (set_op_4 && set_op_4.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_4}` }]);
            }
            if (set_op_5 && set_op_5.trim() !== "") {
                buttonsArray.push([{ text: "💳 Спонсор", url: `https://t.me/${set_op_5}` }]);
            }
            if (true) {
                buttonsArray.push([{ text: "🔄 Проверить", callback_data: "checkch" }]);
                var modifiedSponsorArray = SponsorArray.filter(item => item !== null && item !== "");
                console.log("", modifiedSponsorArray.map(item => "@" + item))
            }
            if ((await bot.getChatMember("", uid)).status == "left") { //сюда собачку
                return message.send(`🔒 <b>Вы не подписаны на наши каналы!</b>`, {
                    parse_mode: "html",
                    reply_markup: {
                        inline_keyboard: buttonsArray
                    }
                });
            }

            if (state[uid] == 100 && ADMINS.indexOf(message.from.id) !== -1 && text != "0") {
                var set_money = (await User.findOne({ id: 0 })).set_money
                state[uid] = undefined

                message.text = Number(message.text);
                let user = await User.findOne({ id: message.text });
                let u = user
                if (!user) return message.send('⚠️ Пользователя нету в вашем боте!');

                let partners = await User.find({ ref: message.text });
                await message.user.set('menu', '');
                var kb = { inline_keyboard: [] }
                if (u.ban) kb.inline_keyboard.push([{ text: "️✅ Разблокировать", callback_data: "unban_" + u.id }])
                else kb.inline_keyboard.push([{ text: "❌ Заблокировать", callback_data: "ban_" + u.id }])
                kb.inline_keyboard.push([{ text: "➕ Баланс вывода", callback_data: "addOutBal_" + u.id }])
                kb.inline_keyboard.push([{ text: "◀️ Назад", callback_data: "admin_return" }])
                return message.send(`👥 Рефералов: <b>${partners.length}</b>
🆔 ID: <code>${user.id}</code>
━━━━━━━━━━━━━━━━━━━━━━━━━
💎 Баланс вывода: ${user.outbalance.toFixed(2)}${set_money}
━━━━━━━━━━━━━━━━━━━━━━━━━
💳 <b>Вывел: ${roundPlus(user.payout)}${set_money}</b>
`, {
                    parse_mode: "HTML",
                    reply_markup: kb
                });

            }

            if (state[uid] == 701 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ $unset: { set_op_1: "" } })
                return message.send(`✅ Вы удалили канал #1 !`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 702 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ $unset: { set_op_2: "" } })
                return message.send(`✅ Вы удалили канал #2 !`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 703 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ $unset: { set_op_3: "" } })
                return message.send(`✅ Вы удалили канал #3 !`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 704 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ $unset: { set_op_4: "" } })
                return message.send(`✅ Вы удалили канал #4 !`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 705 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ $unset: { set_op_5: "" } })
                return message.send(`✅ Вы удалили канал #5 !`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 102 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ set_op_1: text })
                await bot.sendMessage(uid, `✅ Вы установили @${text} на канал #1 !`, { reply_markup: TAPI_admin_return });
                SponsorArray.push('@' + { text })
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 103 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ set_op_2: text })
                await bot.sendMessage(uid, `✅ Вы установили @${text} на канал #2 !`, { reply_markup: TAPI_admin_return });
                SponsorArray.push('@' + { text })
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 104 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ set_op_3: text })
                await bot.sendMessage(uid, `✅ Вы установили @${text} на канал #3 !`, { reply_markup: TAPI_admin_return });
                SponsorArray.push({ set_op_3: text })
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 105 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ set_op_4: text })
                await bot.sendMessage(uid, `✅ Вы установили @${text} на канал #4 !`, { reply_markup: TAPI_admin_return });
                SponsorArray.push('@' + { text })
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 1055 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined;
                await User.findOneAndUpdate({ set_op_5: text })
                await bot.sendMessage(uid, `✅ Вы установили @${text} на канал #5 !`, { reply_markup: TAPI_admin_return });
                SponsorArray.push('@' + { text })
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 106 && ADMINS.indexOf(message.from.id) !== -1) {
                var set_money = (await User.findOne({ id: 0 })).set_money
                state[uid] = undefined
                await User.findOneAndUpdate({ id: data[uid] }, { $inc: { outbalance: Number(text) } })
                bot.sendMessage(data[uid], `✅ Ваш баланс пополнен на <b>${text}${set_money}</b>!`, { parse_mode: html })
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 107 && ADMINS.indexOf(message.from.id) !== -1) {
                var set_money = (await User.findOne({ id: 0 })).set_money
                state[uid] = undefined
                text = Number(text.replace("%", ""))
                await User.findOneAndUpdate({ id: 0 }, { set_ref: text })
                return message.send(`✅ Оплата за реферала ${text}${set_money} установлена!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 108 && ADMINS.indexOf(message.from.id) !== -1) {
                var set_money = (await User.findOne({ id: 0 })).set_money
                state[uid] = undefined
                text = Number(text.replace("%", ""))
                await User.findOneAndUpdate({ id: 0 }, { set_withdraw: text })
                return message.send(`✅ Минимальный вывод ${text}${set_money} установлен!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 109 && ADMINS.indexOf(message.from.id) !== -1) {
                var set_money = (await User.findOne({ id: 0 })).set_money
                state[uid] = undefined
                text = Number(text.replace("%", ""))
                await User.findOneAndUpdate({ id: 0 }, { outbalance: text })
                return message.send(`✅ Бонус в ${text}${set_money} установлен!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 110 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined
                await User.findOneAndUpdate({ set_chat: text })
                return message.send(`✅ Username чата @${text} установлен!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 111 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined
                await User.findOneAndUpdate({ set_userbot: text })
                return message.send(`✅ Username бота @${text} установлен!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 112 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined
                await User.findOneAndUpdate({ set_payment: text })
                return message.send(`✅ Username выплат @${text} установлен!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 113 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined
                await User.findOneAndUpdate({ set_admin: text })
                return message.send(`✅ Username админа @${text} установлен!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 114 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined
                await User.findOneAndUpdate({ set_money: text })
                return message.send(`✅ Валюта ${text} установлена!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 115 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined
                await User.findOneAndUpdate({ set_wallet: text })
                return message.send(`✅ Кошелëк ${text} установлен!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (state[uid] == 116 && ADMINS.indexOf(message.from.id) !== -1) {
                state[uid] = undefined
                await User.findOneAndUpdate({ set_money_message: text })
                return message.send(`✅ Сообщения выплат в ${text} установлены!`, { reply_markup: TAPI_admin_return });
                setTimeout(() => { process.exit(0) }, 333);
            }
            if (message.text) {
                if (message.text == '◀️ Назад') {
                    state[uid] = undefined
                    await message.user.set('menu', '');
                    return message.send('🔒 Вы вернулись в меню! ', {
                        reply_markup: {
                            keyboard: $menu,
                            resize_keyboard: true
                        }
                    });
                }
            }

            if (message.user.menu.startsWith('amountQiwi')) {
                var set_withdraw = (await User.findOne({ id: 0 })).set_withdraw
                var set_money = (await User.findOne({ id: 0 })).set_money
                message.text = Number(message.text);

                if (!message.text) return message.send('💳 Введите сумму которую хотите вывести:');
                if (message.text <= 0) return message.send('💳 Введите сумму которую хотите вывести:');

                if (message.text > message.user.outbalance) return message.send('⚠️ Не пытайтесь обойти систему!');
                if (message.text < set_withdraw) return message.send('⚠️ Недостаточно средств!');


                if (message.text <= message.user.outbalance) {
                    await message.user.dec('outbalance', message.text);
                    let ticket = new Ticket({
                        id: message.from.id,
                        amount: message.text,
                        wallet: message.user.menu.split('amountQiwi')[1]
                    });

                    await ticket.save();
                    await message.user.set('menu', '');

                    ADMINS.map((x) => bot.sendMessage(x, "🔥 У вас новая заявка на выплату!"));

                    bot.sendMessage("@", `👥 <b> <a href="tg://user?id=${message.chat.id}">Пользователь</a> подал заявку на вывод!
🗒️ Дата: ${getTimeString()}
💳 Сумму вывода: ${ticket.amount}${set_money}
💎 Платёжная Система: ${ticket.wallet.indexOf("P") == -1 ? "QIWI" : "PAYEER"}</b>`, { parse_mode: "HTML" })

                    return message.send(`🚀 Ваша заявка готова ожидайте! `, {
                        parse_mode: "HTML",
                        reply_markup: {
                            keyboard: $menu,
                            resize_keyboard: true
                        }
                    });
                }
            }

            if (message.user.menu == 'qiwi') {
                var set_money = (await User.findOne({ id: 0 })).set_money

                if (message.text.length < 0) return message.send('🧐 Походу вы написали неправильный номер!', {
                    reply_markup: {
                        keyboard: Cancel,
                        resize_keyboard: true
                    }
                });



                await message.user.set('menu', 'amountQiwi' + message.text);
                return message.send(`💎 Введите сумму вывода.\n Ваш баланс: ${message.user.outbalance.toFixed(2)}${set_money}`);
            }


            if (message.text == '💜 Заработать') {
                var set_ref = (await User.findOne({ id: 0 })).set_ref
                var set_money = (await User.findOne({ id: 0 })).set_money
                var set_userbot = (await User.findOne({ id: 0 })).set_userbot
                var set_admin = (await User.findOne({ id: 0 })).set_admin
                var set_chat = (await User.findOne({ id: 0 })).set_chat
                var set_payment = (await User.findOne({ id: 0 })).set_payment
                var s = await User.findOne({ id: 0 })
                let t = new Date()
                t = t.getTime() - 1593648000 * 1000
                var day = t / 86400000 ^ 0
                let stats = {
                    users: await User.countDocuments(),
                    users_today: await User.find({ regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}` }),
                    cmds: message.message_id
                }

                stats.users_today = stats.users_today.length;

                return message.send(`💸<b> Мы платим за друзей который перешли по вашей реферальной ссылки!
━━━━━━━━━━━━━━━
👥 За каждого реферала: ${set_ref}${set_money}
━━━━━━━━━━━━━━━
🔎 Ваша реферальная ссылка:</b>
<code>https://t.me/?start=${message.from.id}</code>`, {
                    parse_mode: "HTML",
                    reply_markup: {
                        keyboard: $menu,
                        resize_keyboard: true
                    }
                });
            }


            if (message.text == '💼 Профиль') {
                var set_admin = (await User.findOne({ id: 0 })).set_admin
                var set_chat = (await User.findOne({ id: 0 })).set_chat
                var set_payment = (await User.findOne({ id: 0 })).set_payment
                var set_money = (await User.findOne({ id: 0 })).set_money
                var set_payment = (await User.findOne({ id: 0 })).set_payment
                var set_money = (await User.findOne({ id: 0 })).set_money
                var s = await User.findOne({ id: 0 })
                let t = new Date()
                t = t.getTime() - 1593648000 * 1000
                var day = t / 86400000 ^ 0
                let stats = {
                    users: await User.countDocuments(),
                    users_today: await User.find({ regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}` }),
                    cmds: message.message_id
                }

                stats.users_today = stats.users_today.length;

                return message.send(`🆔 <b>ID:</b> <code>${message.from.id}</code>
	━━━━━━━━━━━━━━━
	💎 <b>Баланс:</b> ${message.user.outbalance.toFixed(2)}${set_money}
	━━━━━━━━━━━━━━━
	👥 У вас рефералов: ${await User.countDocuments({ ref: message.from.id })}
	👤 Вас привел: ${message.user.ref != 0 ? `<a href="tg://user?id=${message.user.ref}">Пользователь</a>` : "<i>Создатель</i>"}`,{
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "📥 Вывести", callback_data: "withdraw" }],
					]
				}
			});
		}

		if (message.text == '📊 Информация') {
			var set_admin = (await User.findOne({ id: 0 })).set_admin
			var set_chat = (await User.findOne({ id: 0 })).set_chat
			var set_payment = (await User.findOne({ id: 0 })).set_payment
			var set_money = (await User.findOne({ id: 0 })).set_money
			var s = await User.findOne({ id: 0 })
			let t = new Date()
            t = t.getTime() - 1593648000 * 1000
			var day = t / 86400000 ^ 0
			let stats = {
				users: await User.countDocuments(),
				users_today: await User.find({ regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}` }),
				cmds: message.message_id
			}

			stats.users_today = stats.users_today.length;

		return message.send(`📗<b> Статистика нашего проекта</b>
━━━━━━━━━━━━━━━
👥 Пользователей всего: <b>${stats.users}</b>
💳 Выплачено всего: <b>${Math.round (s.fc)}${set_money}</b>`,{
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
					    [{ text: "🔥 Хочу такой же бот", url: "" }],
                        [{ text: "👨‍💼 Администратор", url: `` }],
                        [{ text: "💬 Чат", url: `` }, { text: "💳 Выплаты", url: `https://t.me/Seba_vivodi` }],
					]
				}
			});
	}

if (ADMINS.indexOf(message.from.id) !== -1) {
		if (message.text == '/a') {
			var h = process.uptime() / 3600 ^ 0
			var m = (process.uptime() - h * 3600) / 60 ^ 0
			var s = process.uptime() - h * 3600 - m * 60 ^ 0
			var heap = process.memoryUsage().rss / 1048576 ^ 0

         			bot.sendMessage(uid, '<b>🖥️ Центр Администрации:</b>\n\n<b>Нагрузка бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>👥 Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>💾 Нагрузка памяти:</b> ' + heap + "МБ\n<b>💳 Заявок на вывод:</b> " + await Ticket.countDocuments(), { parse_mode: "HTML", reply_markup: TAPI_admin })
		}

		if (message.text.startsWith('/1setbuybalance')) {
			let cmd = message.text.split(' ');
			if (!cmd[1]) return message.send('Ошибка!');

			let user = await User.findOne({ id: Number(cmd[1]) });
			if (!user) return message.send('⚠️ Пользователя ещё нету в вашем боте!');

			await user.set('buybalance', Number(cmd[2]));
			return message.send('Баланс установлен.');
		}

		if (message.text.startsWith('/restart')) {
		  var id = message.user.id
		  ADMINS.map((a) => bot.sendMessage(a, `🔄 Бот перезагружен !`, { parse_mode: "HTML" }))
			setTimeout(() => { process.exit(0) }, 333);
		}

		if (message.text.startsWith('/setoutbalance')) {
			let cmd = message.text.split(' ');
			if (!cmd[1]) return message.send('Ошибка!');

			let user = await User.findOne({ id: Number(cmd[1]) });
			if (!user) return message.send('⚠️ Пользователя ещё нету в вашем боте!');

			await user.set('outbalance', Number(cmd[2]));
			return message.send('Баланс установлен.');
		}
	}
});

bot.on('callback_query', async (query) => {
	const { message } = query;
	message.user = await User.findOne({ id: message.chat.id });
	var uid = message.chat.id
	let dt = new Date
	console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + uid + " отправил колбэк: " + query.data)

	if (dt.getDate() == oplata) return message.send('⛔ Вы не оплатили хостинг!\n🚀 Бот создан с помощью @Seba_Setka');

	if (!message.user) return bot.answerCallbackQuery(query.id, '⚠️ Ошибка!', true);

	if (query.data == 'none') return bot.answerCallbackQuery(query.id, '⚠️ Ошибка!', true);

	if (query.data.startsWith('checkch')) {
	 var set_ref = (await User.findOne({ id: 0 })).set_ref
	 let u = await User.findOne({id: message.chat.id})
	 var modifiedSponsorArray = SponsorArray.filter(item => item !== null && item !== "");
	 var res = await bot.getChatMember("", message.chat.id);

	 if (res.status == 'left') return bot.answerCallbackQuery(query.id, '⛔ Вы не подписаны на наши каналы!', true);
	 await bot.deleteMessage(message.chat.id, message.message_id);
	 await User.findOneAndUpdate({ id: message.chat.id }, { check: false })

		if ( u.ref != 0 && u.checkrefstatus) {
		 await User.findOneAndUpdate({ id: u.ref }, { $inc: { refCount: 1} })
		 await User.findOneAndUpdate({ id: u.ref }, { $inc: { outbalance: set_ref} })
		 await User.findOneAndUpdate({ id: u.id }, { checkrefstatus: false })
		 bot.sendMessage(u.ref, `<b>👤 У вас новый реферал! </b>\n💸 Вы заработали: ${set_ref}${set_money} !`, { parse_mode: "HTML" }).catch((e) => {});
	 }
	 return bot.sendMessage(message.chat.id, '🔥 Спасибо за подписку на спонсоров!', { parse_mode: "HTML" })
 }

	if (query.data == 'setings') {
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `🚀 Настройки вашего бота !`, {
			parse_mode: "HTML",
			reply_markup: {
			     inline_keyboard: [
			            [{ text: "💸 Награда", callback_data: "set_admin" }, { text: "💰 Мин.вывод", callback_data: "admin_wind" }],
                		[{ text: "🎁 Бонус за рег.", callback_data: "admin_bonus" }, { text: "💲 Валюта", callback_data: "user_val" }],
                        [{ text: "💜 Обязательная подписка", callback_data: "setings_op" }],
			          ]
			}

		});
	}

	if (query.data == 'setings_op') {
    var set_op_1 = (await User.findOne({ id: 0 })).set_op_1
    var set_op_2 = (await User.findOne({ id: 0 })).set_op_2
    var set_op_3 = (await User.findOne({ id: 0 })).set_op_3
    var set_op_4 = (await User.findOne({ id: 0 })).set_op_4
    var set_op_5 = (await User.findOne({ id: 0 })).set_op_5
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `🚀 Настройки обязательных подписок для бота!`, {
			parse_mode: "HTML",
			reply_markup: {
			     inline_keyboard: [
			            [{ text: "◽️ Изменить #1", callback_data: "set_op_1" }, { text: "◽️ Удалить #1", callback_data: "del_op_1" }],
                  [{ text: "◽️ Изменить #2", callback_data: "set_op_2" }, { text: "◽️ Удалить #2", callback_data: "del_op_2" }],
                  [{ text: "◽️ Изменить #3", callback_data: "set_op_3" }, { text: "◽️ Удалить #3", callback_data: "del_op_3" }],
                  [{ text: "◽️ Изменить #4", callback_data: "set_op_4" }, { text: "◽️ Удалить #4", callback_data: "del_op_4" }],
                  [{ text: "◽️ Изменить #5", callback_data: "set_op_5" }, { text: "◽️ Удалить #5", callback_data: "del_op_5" }],
			          ]
			}

		});
	}

	if (query.data == 'withdraw') {
		var set_withdraw = (await User.findOne({ id: 0 })).set_withdraw
		var set_wallet = (await User.findOne({ id: 0 })).set_wallet
		var set_money = (await User.findOne({ id: 0 })).set_money
		if (message.user.outbalance < set_withdraw)
			return bot.answerCallbackQuery(query.id, `⚠️ Минимальная сумма вывода: ${set_withdraw}${set_money}\n💳 Ваш баланс: ${message.user.outbalance.toFixed(2)}${set_money}`, true);
		if (message.user.refCount < 0) return bot.answerCallbackQuery(query.id,'🚫 Для вывода требуется 0 рефералов!', true);
		bot.deleteMessage(message.chat.id, message.message_id);
  await bot.sendMessage(message.chat.id, `🚀 Выберите способ вывода`, {
        parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
					[{ text: `◽️ СБП`, callback_data: "wallet" }],
					[{ text: `◽️ Карта РФ`, callback_data: "wallet_1" }],
          [{ text: `◽️ Crypto Bot`, callback_data: "wallet_2" }],
					]
				}
			});
 }

	if(query.data == 'wallet') {
    await message.user.set('menu', 'qiwi');
		await bot.sendMessage(message.chat.id, '📝 Введите номер телефона:', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

	if(query.data == 'wallet_1') {
    await message.user.set('menu', 'qiwi');
		await bot.sendMessage(message.chat.id, '📝 Введите номер карты:', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

  if(query.data == 'wallet_2') {
    await message.user.set('menu', 'qiwi');
		await bot.sendMessage(message.chat.id, '📝 Введите UserName:', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

	if (query.data.startsWith('withdraw:')) {
		var set_money_message = (await User.findOne({ id: 0 })).set_money_message
		var set_admin = (await User.findOne({ id: 0 })).set_admin
		var set_money = (await User.findOne({ id: 0 })).set_money
		let id = Number(query.data.split('withdraw:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);
		if (ticket.wallet.indexOf("P") == -1) {
			bot.sendMessage(set_money_message, `<b><a href="tg://user?id=${ticket.id}">👤 Пользователю</a> выплачено: <b>${ticket.amount}</b>${set_money}</b>`, { parse_mode: "HTML" })
		}
		else
		{
			bot.sendMessage(set_money_message, `<b><a href="tg://user?id=${ticket.id}">👤 Пользователю</a> выплачено: <b>${ticket.amount}</b>${set_money}</b>`, { parse_mode: "HTML" })

		}
		bot.sendMessage(ticket.id,` ✅ <b>Ваша выплата одобрена!</b>
━━━━━━━━━━━━━━━━━━━━━━━━━
📞 Кошелёк: ${ticket.wallet}
💳 Сумма: ${ticket.amount}${set_money}
━━━━━━━━━━━━━━━━━━━━━━━━━
🤝 <b>Рады сотрудничать!</b>`, {
		  parse_mode: "html",
          reply_markup: {
			inline_keyboard: [
			  [{ text: "👨‍💼 Администратор", url: `` }],
			]
		  }
		});

		await User.findOneAndUpdate({ id: 0 }, { $inc: { fc: ticket.amount } })
		await User.findOneAndUpdate({ id: id }, { $inc: { payout: ticket.amount } })
	await ticket.remove();
		bot.editMessageText('💲Вывод пользователю был одобрен!', {
		  chat_id: message.chat.id,
		  message_id: message.message_id
		});
	  }

	if (query.data.startsWith('back:')) {
		let id = Number(query.data.split('back:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);

		let user = await User.findOne({ id: ticket.id });
		bot.sendMessage(ticket.id, `⚠️ Ваша выплата был отклонена!`);

		await user.inc('outbalance', ticket.amount);
		await ticket.remove();

		return bot.editMessageText('❌ Отклонено!', {
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}

	var d = query.data

	if (ADMINS.indexOf(query.from.id) !== -1) {
		if (d == "admin_mm") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '✏️ Введите текст рассылки!', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 99
		} else if (d == "admin_w") {
			var set_money = (await User.findOne({ id: 0 })).set_money
			bot.deleteMessage(message.chat.id, message.message_id);
			let tickets = await Ticket.find();
			if (tickets.length == 0) return bot.sendMessage(uid, '☺️ Походу вы умничка заявок на вывод нету!');
			await tickets.map((x) => {
				bot.sendMessage(uid, `📝: <a href="tg://user?id=${x.id}">Пользователь</a> (ID: <code>${x.id}</code>)\n
	🔥 Сумма: <code>${x.amount}</code>${set_money}
	💳 Кошелёк: <code>${x.wallet}</code>
	🕝 Дата: ${getTimeString()}`, {
					parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: '✔️ Подтвердить', callback_data: `withdraw:${x.id}` }], [{ text: '❌ Отклонить', callback_data: `back:${x.id}` }]] }
				});
			});
		}

		else if (d == "admin_top") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var u = await User.find({ ref: { $ne: 0 }, _id: { $gt: mongo.Types.ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60) } })
			console.log(u)
			var top = []
			u.map((e) => {
				var t = top.filter(u => { if (e.ref == u.id) return true; else return false })
				if (t.length == 0) top.push({ id: e.ref, ref: 1 })
				else {
					top = top.filter(u => { if (e.ref == u.id) return false; else return true })
					top.push({ id: e.ref, ref: t[0].ref + 1 })
				}
			})
			top = top.sort((a, b) => { if (a.ref <= b.ref) return 1; else return -1 })
			top.length = 20
			var str = `<b>🕒 Топ рефоводов:</b>\n\n`
			for (const i in top) {
				var us = await User.findOne({ id: top[i].id })
				str += `<b>${Number(i) + 1})</b> <a href="tg://user?id=${us.id}">${us.name ? us.name : "Пользователь"}</a> - <b>${top[i].ref}</b> друзей\n`
			}
			bot.sendMessage(uid, str, { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_return" }]] }, parse_mode: "HTML" })
		}

		else if (d == "admin_u") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите ID пользователя:', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 100
		}
		else if (d == "del_op_1") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '🚫 Подтвердите удаление !\n\n Напишете боту "Удаляю" !', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 701
			SponsorArray.shift()
		}
		else if (d == "del_op_2") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '🚫 Подтвердите удаление !\n\n Напишете боту "Удаляю" !', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 702
			SponsorArray[2] = null

		}
		else if (d == "del_op_3") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '🚫 Подтвердите удаление !\n\n Напишете боту "Удаляю" !', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 703
			SponsorArray[3] = null
		}
		else if (d == "del_op_4") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '🚫 Подтвердите удаление !\n\n Напишете боту "Удаляю" !', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 704
			SponsorArray[4] = null
		}
		else if (d == "del_op_5") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '🚫 Подтвердите удаление !\n\n Напишете боту "Удаляю" !', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 705
			SponsorArray.pop
		}
		else if (d == "set_op_1") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите username канала', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 102
		}
		else if (d == "set_op_2") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '✅ Вы должны ввести UserName', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 103
		}
		else if (d == "set_op_3") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '✅ Вы должны ввести UserName', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 104
		}
		else if (d == "set_op_4") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, '✅ Вы должны ввести UserName', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 105
		}
    else if (d == "set_op_5") {
      bot.deleteMessage(message.chat.id, message.message_id);
      bot.sendMessage(uid, '✅ Вы должны ввести UserName', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
      state[uid] = 1055
    }

		else if (d.split("_")[0] == "addOutBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму пополнения баланса:', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 106
			data[uid] = d.split("_")[1]
		}
		else if (d == "set_admin") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите реферальную оплату', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 107
		}
		else if (d == "admin_wind") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите минимальный вывод', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 108
		}
		else if (d == "admin_bonus") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите бонус при регистрации в боте', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 109
		}
		else if (d == "user_chat") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите username чата без @', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 110
		}
		else if (d == "user_bot") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите username бота без @', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 111
		}
		else if (d == "user_pay") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите username выплат без @', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 112
		}
		else if (d == "user_admin") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите username админа без @', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 113
		}
		else if (d == "user_val") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите валюту бота', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 114
		}
		else if (d == "user_win") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите кошелëк куда будете выводить', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 115
		}
		else if (d == "user_pay_of") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Напишите username выплат с @', { reply_markup: TAPI_admin_return, parse_mode: "HTML" })
			state[uid] = 116
		}

		else if (d == "admin_mm_stop") {
			var tek = Math.round((mm_i / mm_total) * 40)
			var str = ""
			for (var i = 0; i < tek; i++) str += "+"
			str += '>'
			for (var i = tek + 1; i < 41; i++) str += "-"
			mm_status = false;
			bot.editMessageText("Рассылка остановлена!", { chat_id: mm_achatid, message_id: mm_amsgid })
			mm_u = []
		}
		else if (d == "admin_mm_pause") {
			var tek = Math.round((mm_i / mm_total) * 40)
			var str = ""
			for (var i = 0; i < tek; i++) str += "+"
			str += '>'
			for (var i = tek + 1; i < 41; i++) str += "-"
			bot.editMessageText("<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm2, parse_mode: html })
			mm_status = false;
		}
		else if (d == "admin_mm_play") {
			mm_status = true;
			bot.editMessageText("Выполнено: " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n', { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm1 })
		}
		else if (d.split("_")[0] == "ban") {
			var uuid = Number(d.split("_")[1])
			await User.findOneAndUpdate({ id: uuid }, { ban: true })
			bot.editMessageText('<a href="tg://user?id=' + uuid + '">Пользователь</a> заблокирован!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
		}
		else if (d.split("_")[0] == "unban") {
			var uuid = Number(d.split("_")[1])
			await User.findOneAndUpdate({ id: uuid }, { ban: false })
			bot.editMessageText('<a href="tg://user?id=' + uuid + '">Пользователь</a> разбанен!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
    }
		else if (d == "admin_return") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var h = process.uptime() / 3600 ^ 0
			var m = (process.uptime() - h * 3600) / 60 ^ 0
			var s = process.uptime() - h * 3600 - m * 60 ^ 0
			var heap = process.memoryUsage().rss / 1048576 ^ 0
			var b = (await User.findOne({ id: 0 })).deposit

         			bot.sendMessage(uid, '<b>🖥️ Центр Администрации:</b>\n\n<b>Нагрузка бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>👥 Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>💾 Нагрузка памяти:</b> ' + heap + "МБ\n<b>💳 Заявок на вывод:</b> " + await Ticket.countDocuments(), { parse_mode: "HTML", reply_markup: TAPI_admin })
		}
	}
});

var state = []


User.prototype.inc = function (field, value = 1) {
	this[field] += value;
	return this.save();
}

User.prototype.dec = function (field, value = 1) {
	this[field] -= value;
	return this.save();
}

User.prototype.set = function (field, value) {
	this[field] = value;
	return this.save();
}

async function mmTick() {
	if (mm_status) {
		try {
			mm_i++
			if (mm_type == "text") {
				if (mm_btn_status)
					bot.sendMessage(mm_u[mm_i - 1], mm_text, { reply_markup: { inline_keyboard: [[{ text: mm_btn_text, url: mm_btn_link }]] }, parse_mode: html }).then((err) => { mm_ok++ }).catch((err) => { mm_err++ })
				else
					bot.sendMessage(mm_u[mm_i - 1], mm_text, { parse_mode: html }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { mm_err++ })
			}
			else if (mm_type == "img") {
				if (mm_btn_status)
					bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text, reply_markup: { inline_keyboard: [[{ text: mm_btn_text, url: mm_btn_link }]] } }).then((err) => { mm_ok++ }).catch((err) => { mm_err++ })
				else
					bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { mm_err++ })
			}
			if (mm_i % 10 == 0) {
				var tek = Math.round((mm_i / mm_total) * 40)
				var str = ""
				for (var i = 0; i < tek; i++) str += "+"
				str += '>'
				for (var i = tek + 1; i < 41; i++) str += "-"
				bot.editMessageText("<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm1, parse_mode: html })
			}
			if (mm_i == mm_total) {
				mm_status = false;
				bot.editMessageText("Выполнено: " + mm_i + '/' + mm_total, { chat_id: mm_achatid, message_id: mm_amsgid })
				sendAdmins('<b>Рассылка завершена!\n\nСтатистика:\nУспешно:</b> ' + mm_ok + "\n<b>Неуспешно:</b> " + mm_err, { parse_mode: html })
				mm_u = []
			}
		} finally { }
	}
}

setInterval(mmTick, 100);

var mm_total
var mm_i
var mm_status = false
var mm_amsgid
var mm_type
var mm_imgid
var mm_text
var mm_achatid
var mm_btn_status
var mm_btn_text
var mm_btn_link
var mm_ok
var mm_err

async function mm_t(text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
	let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
	mm_total = ut.length
	console.log(ut)
	mm_u = []
	for (var i = 0; i < mm_total; i++)
		mm_u[i] = ut[i].id
	if (size != 100) {
		mm_u = randomizeArr(mm_u)
		mm_total = Math.ceil(mm_total * (size / 100))
		mm_u.length = mm_total
	}
	ut = undefined
	mm_i = 0;
	mm_amsgid = amsgid
	mm_type = "text"
	mm_text = text
	mm_ok = 0
	mm_err = 0
	mm_achatid = achatid
	if (btn_status) {
		mm_btn_status = true
		mm_btn_text = btn_text
		mm_btn_link = btn_link
	}
	else
		mm_btn_status = false
	mm_status = true;
}

bot.on('photo', async msg => {
	if (msg.from != undefined) {
		var uid = msg.from.id
		if (state[uid] == 99 && ADMINS.indexOf(uid) !== -1) {
			state[uid] = undefined
			var text = ""
			if (msg.caption != undefined) text = msg.caption
			bot.sendMessage(uid, "Рассылка запущена!").then((e) => {
				if (text.split("#").length == 4) {
					var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
					var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
					text = text.split("#")[0].replace(/(^\s*)|(\s*)$/g, '').replace(' ', '')
					mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)

				}
				else
					mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, false, false, false, 100)

			})
		}
	}
})



async function mm_img(img, text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
	let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
	mm_total = ut.length
	mm_u = []
	for (var i = 0; i < mm_total; i++)
		mm_u[i] = ut[i].id
	if (size != 100) {
		mm_u = randomizeArr(mm_u)
		mm_total = Math.ceil(mm_total * (size / 100))
		mm_u.length = mm_total
	}

	ut = undefined
	mm_i = 0;
	mm_amsgid = amsgid
	mm_type = "img"
	mm_text = text
	mm_imgid = img
	mm_ok = 0
	mm_err = 0
	mm_achatid = achatid
	if (btn_status) {
		mm_btn_status = true
		mm_btn_text = btn_text
		mm_btn_link = btn_link
	}
	else
		mm_btn_status = false
	mm_status = true;
}

function randomizeArr(arr) {
	var j, temp;
	for (var i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

const html = "HTML"

function sendAdmins(text, params) { for (var i = 0; i < ADMINS.length; i++) bot.sendMessage(ADMINS[i], text, params) }

var data = []


function roundPlus(number) { if (isNaN(number)) return false; var m = Math.pow(10, 2); return Math.round(number * m) / m; }

async function main() {
	var u = (await User.find({}, { id: 1 })).map((e) => { return e.id })
	for (var i in u) {
		await User.findOneAndUpdate({ id: u[i] }, { refCount: await User.countDocuments({ ref: u[i] }) })
		console.log(i)
	}

}





function randomizeArr(arr) {
	var j, temp;
	for (var i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

function randomInteger(min, max) {

	let rand = min + Math.random() * (max + 1 - min);

	return Math.floor(rand);
}

async function ticker() {
	var d = new Date()
	var minutes = d.getMinutes()
	var hours = d.getHours()
	var date = d.getDate()
	if (minutes == 0 && hours == 0)
		await User.updateMany({}, { spinsToday: 0 })
}

setInterval(ticker, 1000 * 60)


function randomInteger(min, max) {

	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}
User.insertMany([
{ "_id" : "5dfaac928d3ea75ef63263ba", "trees": [ ], "id" : 0, "buybalance" : 0, "outbalance": 0, "klik": 0, "bhivebalance" :0, "wb_profits" : 0, "name" : "TAPI SHOP", "fc" : 0, "ref" : 0, "regDate" : "18/12/2019", "deposit" : 0, "payout" : 0,  "fetuses" : 0, "menu" : "{\"price\":20,\"status\":false,\"count\":5,\"bought\":3}", "statusklik" :"{\"status\":false}", "lastCollect" : 1576709266975, "ban" : false, "refCount" : 0, "not" : false, "__v" : 0, "totalEarn" : 0, "prudLevel" : 0 },
{ "_id" : "5dfbe31493b06e7818e2c5d7", "trees" : [ ], "id" : 1, "menu" : "{\"price\":20,\"status\":true,\"count\":5,\"bought\":3}", "statusklik" :"{\"status\":true}", "__v" : 0, "totalEarn" : 0, "prudLevel" : 0 }
]).then()

User.updateMany({}, {statusklik: ""}).then()

function getTimeString() {
    var date = new Date()
    var day = String(date.getDate())
    if (day.length == 1) day = "0" + day
    var month = String(date.getMonth() + 1)
    if (month.length == 1) month = "0" + month
    var year = date.getFullYear()
    var hour = String(date.getHours() + 3)
    if (hour.length == 1) hour = "0" + hour
    var minute = String(date.getMinutes())
    if (minute.length == 1) minute = "0" + minute
    var second = String(date.getSeconds())
    if (second.length == 1) second = "0" + second
    return `${day}.${month}.${year}\n⏳ Время ${hour}:${minute}:${second}`
}