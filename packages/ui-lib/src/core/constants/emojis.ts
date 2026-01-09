/**
 * Mapeamento centralizado de Emojis
 * Organizado por categorias (estilo WhatsApp/Unicode)
 */

type EmojiDef = { symbol: string; label: string }
type EmojiGroup = Record<string, EmojiDef>

// 1. Smileys & People (Carinhas e Pessoas)
export const SMILEYS_PEOPLE: EmojiGroup = {
    // Faces
    'grinning': { symbol: '😀', label: 'Grinning Face' },
    'smiley': { symbol: '😃', label: 'Grinning Face with Big Eyes' }, // Added
    'smile': { symbol: '😄', label: 'Grinning Face with Smiling Eyes' }, // Updated
    'grin': { symbol: '😁', label: 'Beaming Face with Smiling Eyes' },
    'laughing': { symbol: '😆', label: 'Grinning Squinting Face' }, // Added
    'sweat_smile': { symbol: '😅', label: 'Grinning Face with Sweat' }, // Added
    'joy': { symbol: '😂', label: 'Face with Tears of Joy' },
    'rofl': { symbol: '🤣', label: 'Rolling on the Floor Laughing' },
    'relaxed': { symbol: '☺️', label: 'Smiling Face' }, // Added
    'blush': { symbol: '😊', label: 'Smiling Face with Smiling Eyes' },
    'innocent': { symbol: '😇', label: 'Smiling Face with Halo' },
    'slightly_smiling_face': { symbol: '🙂', label: 'Slightly Smiling Face' }, // Added (was 'smile')
    'upside_down_face': { symbol: '🙃', label: 'Upside-Down Face' }, // Added
    'wink': { symbol: '😉', label: 'Winking Face' },
    'relieved': { symbol: '😌', label: 'Relieved Face' }, // Added
    'heart_eyes': { symbol: '😍', label: 'Smiling Face with Heart-Eyes' },
    'smiling_face_with_three_hearts': { symbol: '🥰', label: 'Smiling Face with Hearts' }, // Added
    'kissing_heart': { symbol: '😘', label: 'Face Blowing a Kiss' },
    'kissing': { symbol: '😗', label: 'Kissing Face' }, // Added
    'kissing_smiling_eyes': { symbol: '😙', label: 'Kissing Face with Smiling Eyes' }, // Added
    'kissing_closed_eyes': { symbol: '😚', label: 'Kissing Face with Closed Eyes' }, // Added
    'yum': { symbol: '😋', label: 'Face Savoring Food' },
    'stuck_out_tongue': { symbol: '😛', label: 'Face with Tongue' },
    'stuck_out_tongue_winking_eye': { symbol: '😜', label: 'Winking Face with Tongue' }, // Added
    'zany_face': { symbol: '🤪', label: 'Zany Face' }, // Added
    'stuck_out_tongue_closed_eyes': { symbol: '😝', label: 'Squinting Face with Tongue' }, // Added
    'money_mouth_face': { symbol: '🤑', label: 'Money-Mouth Face' }, // Added
    'hugs': { symbol: '🤗', label: 'Hugging Face' }, // Added
    'hand_over_mouth': { symbol: '🤭', label: 'Face with Hand Over Mouth' }, // Added
    'shushing_face': { symbol: '🤫', label: 'Shushing Face' }, // Added
    'thinking': { symbol: '🤔', label: 'Thinking Face' },
    'zipper_mouth_face': { symbol: '🤐', label: 'Zipper-Mouth Face' }, // Added
    'raised_eyebrow': { symbol: '🤨', label: 'Face with Raised Eyebrow' }, // Added
    'neutral_face': { symbol: '😐', label: 'Neutral Face' },
    'expressionless': { symbol: '😑', label: 'Expressionless Face' },
    'no_mouth': { symbol: '😶', label: 'Face Without Mouth' }, // Added
    'face_in_clouds': { symbol: '😶‍🌫️', label: 'Face in Clouds' }, // Added
    'smirk': { symbol: '😏', label: 'Smirking Face' },
    'unamused': { symbol: '😒', label: 'Unamused Face' },
    'roll_eyes': { symbol: '🙄', label: 'Face with Rolling Eyes' }, // Added
    'grimacing': { symbol: '😬', label: 'Grimacing Face' },
    'lying_face': { symbol: '🤥', label: 'Lying Face' }, // Added
    'relieved_face': { symbol: '😌', label: 'Relieved Face' }, // Added
    'pensive': { symbol: '😔', label: 'Pensive Face' },
    'sleepy': { symbol: '😪', label: 'Sleepy Face' }, // Added
    'drooling_face': { symbol: '🤤', label: 'Drooling Face' }, // Added
    'sleeping': { symbol: '😴', label: 'Sleeping Face' }, // Added
    'mask': { symbol: '😷', label: 'Face with Medical Mask' }, // Added
    'face_with_thermometer': { symbol: '🤒', label: 'Face with Thermometer' }, // Added
    'face_with_head_bandage': { symbol: '🤕', label: 'Face with Head-Bandage' }, // Added
    'nauseated_face': { symbol: '🤢', label: 'Nauseated Face' }, // Added
    'vomiting_face': { symbol: '🤮', label: 'Face Vomiting' }, // Added
    'sneezing_face': { symbol: '🤧', label: 'Sneezing Face' }, // Added
    'hot_face': { symbol: '🥵', label: 'Hot Face' }, // Added
    'cold_face': { symbol: '🥶', label: 'Cold Face' }, // Added
    'woozy_face': { symbol: '🥴', label: 'Woozy Face' }, // Added
    'dizzy_face': { symbol: '😵', label: 'Dizzy Face' }, // Added
    'exploding_head': { symbol: '🤯', label: 'Exploding Head' }, // Added
    'cowboy_hat_face': { symbol: '🤠', label: 'Cowboy Hat Face' }, // Added
    'partying_face': { symbol: '🥳', label: 'Partying Face' }, // Added
    'sunglasses': { symbol: '😎', label: 'Smiling Face with Sunglasses' },
    'nerd_face': { symbol: '🤓', label: 'Nerd Face' }, // Added
    'monocle_face': { symbol: '🧐', label: 'Face with Monocle' }, // Added
    'confused': { symbol: '😕', label: 'Confused Face' },
    'worried': { symbol: '😟', label: 'Worried Face' }, // Added
    'slightly_frowning_face': { symbol: '🙁', label: 'Slightly Frowning Face' }, // Added
    'frowning_face': { symbol: '☹️', label: 'Frowning Face' }, // Added
    'open_mouth': { symbol: '😮', label: 'Face with Open Mouth' }, // Added
    'hushed': { symbol: '😯', label: 'Hushed Face' }, // Added
    'astonished': { symbol: '😲', label: 'Astonished Face' }, // Added
    'flushed': { symbol: '😳', label: 'Flushed Face' }, // Added
    'pleading_face': { symbol: '🥺', label: 'Pleading Face' }, // Added
    'frowning': { symbol: '😦', label: 'Frowning Face with Open Mouth' }, // Added
    'anguished': { symbol: '😧', label: 'Anguished Face' }, // Added
    'fearful': { symbol: '😨', label: 'Fearful Face' }, // Added
    'cold_sweat': { symbol: '😰', label: 'Anxious Face with Sweat' }, // Added
    'disappointed_relieved': { symbol: '😥', label: 'Sad but Relieved Face' }, // Added
    'cry': { symbol: '😢', label: 'Crying Face' }, // Added
    'sob': { symbol: '😭', label: 'Loudly Crying Face' },
    'scream': { symbol: '😱', label: 'Face Screaming in Fear' },
    'confounded': { symbol: '😖', label: 'Confounded Face' }, // Added
    'persevere': { symbol: '😣', label: 'Persevering Face' }, // Added
    'disappointed': { symbol: '😞', label: 'Disappointed Face' }, // Added
    'sweat': { symbol: '😓', label: 'Downcast Face with Sweat' }, // Added
    'weary': { symbol: '😩', label: 'Weary Face' }, // Added
    'tired_face': { symbol: '😫', label: 'Tired Face' }, // Added
    'yawning_face': { symbol: '🥱', label: 'Yawning Face' }, // Added
    'triumph': { symbol: '😤', label: 'Face with Steam From Nose' }, // Added
    'angry': { symbol: '😠', label: 'Angry Face' },
    'rage': { symbol: '😡', label: 'Pouting Face' },
    'cursing_face': { symbol: '🤬', label: 'Face with Symbols on Mouth' }, // Added
    'smiling_imp': { symbol: '😈', label: 'Smiling Face with Horns' }, // Added
    'imp': { symbol: '👿', label: 'Angry Face with Horns' }, // Added
    'skull': { symbol: '💀', label: 'Skull' },
    'skull_and_crossbones': { symbol: '☠️', label: 'Skull and Crossbones' }, // Added
    'poop': { symbol: '💩', label: 'Pile of Poo' },
    'clown_face': { symbol: '🤡', label: 'Clown Face' },
    'ghost': { symbol: '👻', label: 'Ghost' },
    'alien': { symbol: '👽', label: 'Alien' },
    'space_invader': { symbol: '👾', label: 'Alien Monster' }, // Added
    'robot': { symbol: '🤖', label: 'Robot' },
    'star_struck': { symbol: '🤩', label: 'Star-Struck' }, // Moved

    // Hands
    'wave': { symbol: '👋', label: 'Waving Hand' },
    'raised_back_of_hand': { symbol: '🤚', label: 'Raised Back of Hand' }, // Added
    'raised_hand': { symbol: '✋', label: 'raised Hand' },
    'vulcan_salute': { symbol: '🖖', label: 'Vulcan Salute' }, // Added
    'ok_hand': { symbol: '👌', label: 'OK Hand' },
    'pinched_fingers': { symbol: '🤌', label: 'Pinched Fingers' }, // Added
    'pinching_hand': { symbol: '🤏', label: 'Pinching Hand' }, // Added
    'v': { symbol: '✌️', label: 'Victory Hand' },
    'crossed_fingers': { symbol: '🤞', label: 'Crossed Fingers' }, // Added
    'love_you_gesture': { symbol: '🤟', label: 'Love-You Gesture' }, // Added
    'metal': { symbol: '🤘', label: 'Sign of the Horns' }, // Added
    'call_me': { symbol: '🤙', label: 'Call Me Hand' },
    'point_left': { symbol: '👈', label: 'Backhand Index Pointing Left' }, // Added
    'point_right': { symbol: '👉', label: 'Backhand Index Pointing Right' }, // Added
    'point_up_2': { symbol: '👆', label: 'Backhand Index Pointing Up' }, // Added
    'middle_finger': { symbol: '🖕', label: 'Middle Finger' }, // Added
    'point_down': { symbol: '👇', label: 'Backhand Index Pointing Down' }, // Added
    'point_up': { symbol: '☝️', label: 'Index Pointing Up' },
    'thumbsup': { symbol: '👍', label: 'Thumbs Up' },
    'thumbsdown': { symbol: '👎', label: 'Thumbs Down' },
    'fist': { symbol: '✊', label: 'Raised Fist' },
    'fist_oncoming': { symbol: '👊', label: 'Oncoming Fist' }, // Updated
    'fist_left': { symbol: '🤛', label: 'Left-Facing Fist' }, // Added
    'fist_right': { symbol: '🤜', label: 'Right-Facing Fist' }, // Added
    'clap': { symbol: '👏', label: 'Clapping Hands' },
    'raised_hands': { symbol: '🙌', label: 'Raising Hands' },
    'open_hands': { symbol: '👐', label: 'Open Hands' },
    'palms_up_together': { symbol: '🤲', label: 'Palms Up Together' }, // Added
    'handshake': { symbol: '🤝', label: 'Handshake' },
    'pray': { symbol: '🙏', label: 'Folded Hands' },
    'writing_hand': { symbol: '✍️', label: 'Writing Hand' }, // Added
    'nail_care': { symbol: '💅', label: 'Nail Polish' },
    'selfie': { symbol: '🤳', label: 'Selfie' }, // Added
    'muscle': { symbol: '💪', label: 'Flexed Biceps' },
    'mechanical_arm': { symbol: '🦾', label: 'Mechanical Arm' }, // Added
    'mechanical_leg': { symbol: '🦿', label: 'Mechanical Leg' }, // Added
    'leg': { symbol: '🦵', label: 'Leg' }, // Added
    'foot': { symbol: '🦶', label: 'Foot' }, // Added
    'ear': { symbol: '👂', label: 'Ear' }, // Added
    'ear_with_hearing_aid': { symbol: '🦻', label: 'Ear with Hearing Aid' }, // Added
    'nose': { symbol: '👃', label: 'Nose' }, // Added
    'brain': { symbol: '🧠', label: 'Brain' }, // Added
    'anatomical_heart': { symbol: '🫀', label: 'Anatomical Heart' }, // Added
    'lungs': { symbol: '🫁', label: 'Lungs' }, // Added
    'tooth': { symbol: '🦷', label: 'Tooth' }, // Added
    'bone': { symbol: '🦴', label: 'Bone' }, // Added
    'eyes': { symbol: '👀', label: 'Eyes' }, // Added (duplicate usually in animals but fitting here too)
    'eye': { symbol: '👁️', label: 'Eye' }, // Added
    'tongue': { symbol: '👅', label: 'Tongue' }, // Added
    'lips': { symbol: '👄', label: 'Mouth' }, // Added
}

// 2. Animals & Nature (Animais e Natureza)
export const ANIMALS_NATURE: EmojiGroup = {
    'dog': { symbol: '🐶', label: 'Dog Face' },
    'cat': { symbol: '🐱', label: 'Cat Face' },
    'mouse': { symbol: '🐭', label: 'Mouse Face' },
    'hamster': { symbol: '🐹', label: 'Hamster Face' },
    'rabbit': { symbol: '🐰', label: 'Rabbit Face' },
    'fox_face': { symbol: '🦊', label: 'Fox' },
    'bear': { symbol: '🐻', label: 'Bear' },
    'panda_face': { symbol: '🐼', label: 'Panda' },
    'koala': { symbol: '🐨', label: 'Koala' },
    'tiger': { symbol: '🐯', label: 'Tiger Face' },
    'lion': { symbol: '🦁', label: 'Lion' },
    'cow': { symbol: '🐮', label: 'Cow Face' },
    'pig': { symbol: '🐷', label: 'Pig Face' },
    'frog': { symbol: '🐸', label: 'Frog' },
    'monkey_face': { symbol: '🐵', label: 'Monkey Face' },
    'see_no_evil': { symbol: '🙈', label: 'See-No-Evil Monkey' },
    'hear_no_evil': { symbol: '🙉', label: 'Hear-No-Evil Monkey' },
    'speak_no_evil': { symbol: '🙊', label: 'Speak-No-Evil Monkey' },
    'bird': { symbol: '🐦', label: 'Bird' },
    'skull_crossbones': { symbol: '☠️', label: 'Skull and Crossbones' },
    'eyes': { symbol: '👀', label: 'Eyes' },

    // Nature
    'cactus': { symbol: '🌵', label: 'Cactus' },
    'christmas_tree': { symbol: '🎄', label: 'Christmas Tree' },
    'deciduous_tree': { symbol: '🌳', label: 'Deciduous Tree' },
    'palm_tree': { symbol: '🌴', label: 'Palm Tree' },
    'seedling': { symbol: '🌱', label: 'Seedling' },
    'herb': { symbol: '🌿', label: 'Herb' },
    'four_leaf_clover': { symbol: '🍀', label: 'Four Leaf Clover' },
    'maple_leaf': { symbol: '🍁', label: 'Maple Leaf' },
    'mushroom': { symbol: '🍄', label: 'Mushroom' },
    'bouquet': { symbol: '💐', label: 'Bouquet' },
    'cherry_blossom': { symbol: '🌸', label: 'Cherry Blossom' },
    'rose': { symbol: '🌹', label: 'Rose' },
    'sunflower': { symbol: '🌻', label: 'Sunflower' },
    'fire': { symbol: '🔥', label: 'Fire' },
    'rainbow': { symbol: '🌈', label: 'Rainbow' },
    'sunny': { symbol: '☀️', label: 'Sun' },
    'star': { symbol: '⭐', label: 'Star' },
    'sparkles': { symbol: '✨', label: 'Sparkles' },
    'zap': { symbol: '⚡', label: 'High Voltage' },
    'boom': { symbol: '💥', label: 'Collision' },
    'droplet': { symbol: '💧', label: 'Droplet' },
    'ocean': { symbol: '🌊', label: 'Water Wave' },
}

// 3. Food & Drink (Comida e Bebida)
export const FOOD_DRINK: EmojiGroup = {
    'green_apple': { symbol: '🍏', label: 'Green Apple' },
    'apple': { symbol: '🍎', label: 'Red Apple' },
    'pear': { symbol: '🍐', label: 'Pear' },
    'tangerine': { symbol: '🍊', label: 'Tangerine' },
    'lemon': { symbol: '🍋', label: 'Lemon' },
    'banana': { symbol: '🍌', label: 'Banana' },
    'watermelon': { symbol: '🍉', label: 'Watermelon' },
    'grapes': { symbol: '🍇', label: 'Grapes' },
    'strawberry': { symbol: '🍓', label: 'Strawberry' },
    'melon': { symbol: '🍈', label: 'Melon' },
    'cherries': { symbol: '🍒', label: 'Cherries' },
    'peach': { symbol: '🍑', label: 'Peach' },
    'pineapple': { symbol: '🍍', label: 'Pineapple' },
    'coconut': { symbol: '🥥', label: 'Coconut' },
    'kiwi_fruit': { symbol: '🥝', label: 'Kiwi Fruit' },
    'avocado': { symbol: '🥑', label: 'Avocado' },
    'eggplant': { symbol: '🍆', label: 'Eggplant' },
    'carrot': { symbol: '🥕', label: 'Carrot' },
    'corn': { symbol: '🌽', label: 'Ear of Corn' },
    'hot_pepper': { symbol: '🌶️', label: 'Hot Pepper' },
    'hamburger': { symbol: '🍔', label: 'Hamburger' },
    'pizza': { symbol: '🍕', label: 'Pizza' },
    'hotdog': { symbol: '🌭', label: 'Hot Dog' },
    'fries': { symbol: '🍟', label: 'French Fries' },
    'sushi': { symbol: '🍣', label: 'Sushi' },
    'ice_cream': { symbol: '🍦', label: 'Soft Ice Cream' },
    'donut': { symbol: '🍩', label: 'Doughnut' },
    'cookie': { symbol: '🍪', label: 'Cookie' },
    'cake': { symbol: '🍰', label: 'Shortcake' },
    'chocolate_bar': { symbol: '🍫', label: 'Chocolate Bar' },
    'candy': { symbol: '🍬', label: 'Candy' },
    'lollipop': { symbol: '🍭', label: 'Lollipop' },
    'popcorn': { symbol: '🍿', label: 'Popcorn' },
    'coffee': { symbol: '☕', label: 'Hot Beverage' },
    'beer': { symbol: '🍺', label: 'Beer Mug' },
    'beers': { symbol: '🍻', label: 'Clinking Beer Mugs' },
    'wine_glass': { symbol: '🍷', label: 'Wine Glass' },
    'cocktail': { symbol: '🍸', label: 'Cocktail Glass' },
    'tropical_drink': { symbol: '🍹', label: 'Tropical Drink' },
    'champagne': { symbol: '🍾', label: 'Champagne' },
    'clinking_glasses': { symbol: '🥂', label: 'Clinking Glasses' },
}

// 4. Activity (Atividades e Esportes)
export const ACTIVITIES: EmojiGroup = {
    'soccer': { symbol: '⚽', label: 'Soccer Ball' },
    'basketball': { symbol: '🏀', label: 'Basketball' },
    'football': { symbol: '🏈', label: 'American Football' },
    'baseball': { symbol: '⚾', label: 'Baseball' },
    'tennis': { symbol: '🎾', label: 'Tennis' },
    'volleyball': { symbol: '🏐', label: 'Volleyball' },
    'rugby_football': { symbol: '🏉', label: 'Rugby Football' },
    '8ball': { symbol: '🎱', label: 'Pool 8 Ball' },
    'ping_pong': { symbol: '🏓', label: 'Ping Pong' },
    'badminton': { symbol: '🏸', label: 'Badminton' },
    'boxing_glove': { symbol: '🥊', label: 'Boxing Glove' },
    'martial_arts_uniform': { symbol: '🥋', label: 'Martial Arts Uniform' },
    'goal_net': { symbol: '🥅', label: 'Goal Net' },
    'dart': { symbol: '🎯', label: 'Direct Hit' },
    'golf': { symbol: '⛳', label: 'Flag in Hole' },
    'ice_skate': { symbol: '⛸️', label: 'Ice Skate' },
    'fishing_pole_and_fish': { symbol: '🎣', label: 'Fishing Pole' },
    'running_shirt_with_sash': { symbol: '🎽', label: 'Running Shirt' },
    'ski': { symbol: '🎿', label: 'Skis' },
    'video_game': { symbol: '🎮', label: 'Video Game' },
    'slot_machine': { symbol: '🎰', label: 'Slot Machine' },
    'tada': { symbol: '🎉', label: 'Party Popper' },
    'confetti_ball': { symbol: '🎊', label: 'Confetti Ball' },
    'balloon': { symbol: '🎈', label: 'Balloon' },
    'trophy': { symbol: '🏆', label: 'Trophy' },
    'medal_sports': { symbol: '🏅', label: 'Sports Medal' },
    'first_place_medal': { symbol: '🥇', label: '1st Place Medal' },
    'musical_note': { symbol: '🎵', label: 'Musical Note' },
    'notes': { symbol: '🎶', label: 'Musical Notes' },
    'studio_microphone': { symbol: '🎙️', label: 'Studio Microphone' },
    'movie_camera': { symbol: '🎥', label: 'Movie Camera' },
    'headphones': { symbol: '🎧', label: 'Headphone' },
    'art': { symbol: '🎨', label: 'Artist Palette' },
    'circus_tent': { symbol: '🎪', label: 'Circus Tent' },
    'ticket': { symbol: '🎫', label: 'Ticket' },
}

// 5. Travel & Places (Viagem e Lugares)
export const TRAVEL_PLACES: EmojiGroup = {
    'earth_americas': { symbol: '🌎', label: 'Earth Americas' },
    'earth_africa': { symbol: '🌍', label: 'Earth Africa' },
    'earth_asia': { symbol: '🌏', label: 'Earth Asia' },
    'volcano': { symbol: '🌋', label: 'Volcano' },
    'mount_fuji': { symbol: '🗻', label: 'Mount Fuji' },
    'house': { symbol: '🏠', label: 'House' },
    'hospital': { symbol: '🏥', label: 'Hospital' },
    'office': { symbol: '🏢', label: 'Office Building' },
    'post_office': { symbol: '🏣', label: 'Japanese Post Office' },
    'european_post_office': { symbol: '🏤', label: 'Post Office' },
    'bank': { symbol: '🏦', label: 'Bank' },
    'hotel': { symbol: '🏨', label: 'Hotel' },
    'convenience_store': { symbol: '🏪', label: 'Convenience Store' },
    'school': { symbol: '🏫', label: 'School' },
    'factory': { symbol: '🏭', label: 'Factory' },
    'castle': { symbol: '🏰', label: 'Castle' },
    'wedding': { symbol: '💒', label: 'Wedding' },
    'tower': { symbol: '🗼', label: 'Tokyo Tower' },
    'statue_of_liberty': { symbol: '🗽', label: 'Statue of Liberty' },
    'church': { symbol: '⛪', label: 'Church' },
    'fountain': { symbol: '⛲', label: 'Fountain' },
    'tent': { symbol: '⛺', label: 'Tent' },
    'foggy': { symbol: '🌁', label: 'Foggy' },
    'night_with_stars': { symbol: '🌃', label: 'Night with Stars' },
    'sunrise_over_mountains': { symbol: '🌄', label: 'Sunrise over Mountains' },
    'sunrise': { symbol: '🌅', label: 'Sunrise' },
    'city_sunset': { symbol: '🌆', label: 'Cityscape at Dusk' },
    'city_sunrise': { symbol: '🌇', label: 'Sunset' },
    'bridge_at_night': { symbol: '🌉', label: 'Bridge at Night' },

    // Transport
    'car': { symbol: '🚗', label: 'Automobile' },
    'taxi': { symbol: '🚕', label: 'Taxi' },
    'bus': { symbol: '🚌', label: 'Bus' },
    'trolleybus': { symbol: '🚎', label: 'Trolleybus' },
    'racing_car': { symbol: '🏎️', label: 'Racing Car' },
    'police_car': { symbol: '🚓', label: 'Police Car' },
    'ambulance': { symbol: '🚑', label: 'Ambulance' },
    'fire_engine': { symbol: '🚒', label: 'Fire Engine' },
    'minibus': { symbol: '🚐', label: 'Minibus' },
    'truck': { symbol: '🚚', label: 'Delivery Truck' },
    'tractor': { symbol: '🚜', label: 'Tractor' },
    'bike': { symbol: '🚲', label: 'Bicycle' },
    'scooter': { symbol: '🛴', label: 'Kick Scooter' },
    'motor_scooter': { symbol: '🛵', label: 'Motor Scooter' },
    'bus_stop': { symbol: '🚏', label: 'Bus Stop' },
    'fuelpump': { symbol: '⛽', label: 'Fuel Pump' },
    'rotating_light': { symbol: '🚨', label: 'Police Cars Revolving Light' },
    'traffic_light': { symbol: '🚥', label: 'Traffic Light' },
    'construction': { symbol: '🚧', label: 'Construction' },
    'anchor': { symbol: '⚓', label: 'Anchor' },
    'sailboat': { symbol: '⛵', label: 'Sailboat' },
    'speedboat': { symbol: '🚤', label: 'Speedboat' },
    'passenger_ship': { symbol: '🛳️', label: 'Passenger Ship' },
    'airplane': { symbol: '✈️', label: 'Airplane' },
    'seat': { symbol: '💺', label: 'Seat' },
    'helicopter': { symbol: '🚁', label: 'Helicopter' },
    'rocket': { symbol: '🚀', label: 'Rocket' },
    'saucer': { symbol: '🛸', label: 'Flying Saucer' },
    'hourglass': { symbol: '⌛', label: 'Hourglass' },
    'watch': { symbol: '⌚', label: 'Watch' },
}

// 6. Objects (Objetos)
export const OBJECTS: EmojiGroup = {
    'phone': { symbol: '☎️', label: 'Telephone' },
    'telephone_receiver': { symbol: '📞', label: 'Telephone Receiver' },
    'pager': { symbol: '📟', label: 'Pager' },
    'fax': { symbol: '📠', label: 'Fax Machine' },
    'battery': { symbol: '🔋', label: 'Battery' },
    'electric_plug': { symbol: '🔌', label: 'Electric Plug' },
    'computer': { symbol: '💻', label: 'Laptop Computer' },
    'printer': { symbol: '🖨️', label: 'Printer' },
    'keyboard': { symbol: '⌨️', label: 'Keyboard' },
    'mouse_three_button': { symbol: '🖱️', label: 'Computer Mouse' },
    'minidisc': { symbol: '💽', label: 'Computer Disk' },
    'floppy_disk': { symbol: '💾', label: 'Floppy Disk' },
    'cd': { symbol: '💿', label: 'Optical Disc' },
    'dvd': { symbol: '📀', label: 'DVD' },
    'tv': { symbol: '📺', label: 'Television' },
    'camera': { symbol: '📷', label: 'Camera' },
    'camera_flash': { symbol: '📸', label: 'Camera with Flash' },
    'video_camera': { symbol: '📹', label: 'Video Camera' },
    'vhs': { symbol: '📼', label: 'Videocassette' },
    'magnifying_glass_tilted_left': { symbol: '🔍', label: 'Magnifying Glass Tilted Left' },
    'microscope': { symbol: '🔬', label: 'Microscope' },
    'telescope': { symbol: '🔭', label: 'Telescope' },
    'satellite_antenna': { symbol: '📡', label: 'Satellite Antenna' },
    'candle': { symbol: '🕯️', label: 'Candle' },
    'bulb': { symbol: '💡', label: 'Light Bulb' },
    'flashlight': { symbol: '🔦', label: 'Flashlight' },
    'notebook_with_decorative_cover': { symbol: '📔', label: 'Notebook' },
    'closed_book': { symbol: '📕', label: 'Closed Book' },
    'book': { symbol: '📖', label: 'Open Book' },
    'green_book': { symbol: '📗', label: 'Green Book' },
    'blue_book': { symbol: '📘', label: 'Blue Book' },
    'orange_book': { symbol: '📙', label: 'Orange Book' },
    'books': { symbol: '📚', label: 'Books' },
    'notebook': { symbol: '📓', label: 'Notebook' },
    'ledger': { symbol: '📒', label: 'Ledger' },
    'page_with_curl': { symbol: '📃', label: 'Page with Curl' },
    'scroll': { symbol: '📜', label: 'Scroll' },
    'page_facing_up': { symbol: '📄', label: 'Page Facing Up' },
    'newspaper': { symbol: '📰', label: 'Newspaper' },
    'bookmark_tabs': { symbol: '📑', label: 'Bookmark Tabs' },
    'bookmark': { symbol: '🔖', label: 'Bookmark' },
    'moneybag': { symbol: '💰', label: 'Money Bag' },
    'yen': { symbol: '💴', label: 'Yen Banknote' },
    'dollar': { symbol: '💵', label: 'Dollar Banknote' },
    'euro': { symbol: '💶', label: 'Euro Banknote' },
    'pound': { symbol: '💷', label: 'Pound Banknote' },
    'credit_card': { symbol: '💳', label: 'Credit Card' },
    'chart': { symbol: '💹', label: 'Chart with Upwards Trend and Yen Sign' },
    'currency_exchange': { symbol: '💱', label: 'Currency Exchange' },
    'heavy_dollar_sign': { symbol: '💲', label: 'Heavy Dollar Sign' },
    'envelope': { symbol: '✉️', label: 'Envelope' },
    'e-mail': { symbol: '📧', label: 'E-Mail' },
    'incoming_envelope': { symbol: '📨', label: 'Incoming Envelope' },
    'envelope_with_arrow': { symbol: '📩', label: 'Envelope with Arrow' },
    'outbox_tray': { symbol: '📤', label: 'Outbox Tray' },
    'inbox_tray': { symbol: '📥', label: 'Inbox Tray' },
    'package': { symbol: '📦', label: 'Package' },
    'mailbox': { symbol: '📫', label: 'Mailbox' },
    'mailbox_closed': { symbol: '📪', label: 'Closed Mailbox' },
    'mailbox_with_mail': { symbol: '📬', label: 'Mailbox with Mail' },
    'mailbox_with_no_mail': { symbol: '📭', label: 'Open Mailbox with Lowered Flag' },
    'postbox': { symbol: '📮', label: 'Postbox' },
    'pencil2': { symbol: '✏️', label: 'Pencil' },
    'black_nib': { symbol: '✒️', label: 'Black Nib' },
    'memo': { symbol: '📝', label: 'Memo' },
    'briefcase': { symbol: '💼', label: 'Briefcase' },
    'file_folder': { symbol: '📁', label: 'File Folder' },
    'open_file_folder': { symbol: '📂', label: 'Open File Folder' },
    'date': { symbol: '📅', label: 'Calendar' },
    'calendar': { symbol: '📆', label: 'Tear-off Calendar' },
    'card_index': { symbol: '📇', label: 'Card Index' },
    'chart_with_upwards_trend': { symbol: '📈', label: 'Chart Increasing' },
    'chart_with_downwards_trend': { symbol: '📉', label: 'Chart Decreasing' },
    'bar_chart': { symbol: '📊', label: 'Bar Chart' },
    'clipboard': { symbol: '📋', label: 'Clipboard' },
    'pushpin': { symbol: '📌', label: 'Pushpin' },
    'round_pushpin': { symbol: '📍', label: 'Round Pushpin' },
    'paperclip': { symbol: '📎', label: 'Paperclip' },
    'straight_ruler': { symbol: '📏', label: 'Straight Ruler' },
    'triangular_ruler': { symbol: '📐', label: 'Triangular Ruler' },
    'scissors': { symbol: '✂️', label: 'Scissors' },
    'lock': { symbol: '🔒', label: 'Lock' },
    'unlock': { symbol: '🔓', label: 'Unlock' },
    'lock_with_ink_pen': { symbol: '🔏', label: 'Locked with Pen' },
    'closed_lock_with_key': { symbol: '🔐', label: 'Locked with Key' },
    'key': { symbol: '🔑', label: 'Key' },
    'hammer': { symbol: '🔨', label: 'Hammer' },
    'hammer_and_pick': { symbol: '⚒️', label: 'Hammer and Pick' },
    'pick': { symbol: '⛏️', label: 'Pick' },
    'tools': { symbol: '🛠️', label: 'Hammer and Wrench' },
    'dagger': { symbol: '🗡️', label: 'Dagger' },
    'crossed_swords': { symbol: '⚔️', label: 'Crossed Swords' },
    'shield': { symbol: '🛡️', label: 'Shield' },
    'wrench': { symbol: '🔧', label: 'Wrench' },
    'nut_and_bolt': { symbol: '🔩', label: 'Nut and Bolt' },
    'gear': { symbol: '⚙️', label: 'Gear' },
    'scales': { symbol: '⚖️', label: 'Balance Scale' },
    'link': { symbol: '🔗', label: 'Link' },
    'chains': { symbol: '⛓️', label: 'Chains' },
    'trash': { symbol: '🗑️', label: 'Wastebasket' },
}

// 7. Symbols (Símbolos)
export const SYMBOLS: EmojiGroup = {
    'heart': { symbol: '❤️', label: 'Red Heart' },
    'orange_heart': { symbol: '🧡', label: 'Orange Heart' },
    'yellow_heart': { symbol: '💛', label: 'Yellow Heart' },
    'green_heart': { symbol: '💚', label: 'Green Heart' },
    'blue_heart': { symbol: '💙', label: 'Blue Heart' },
    'purple_heart': { symbol: '💜', label: 'Purple Heart' },
    'black_heart': { symbol: '🖤', label: 'Black Heart' },
    'broken_heart': { symbol: '💔', label: 'Broken Heart' },
    'heavy_heart_exclamation': { symbol: '❣️', label: 'Heart Exclamation' },
    'two_hearts': { symbol: '💕', label: 'Two Hearts' },
    'revolving_hearts': { symbol: '💞', label: 'Revolving Hearts' },
    'heartbeat': { symbol: '💓', label: 'Beating Heart' },
    'heartpulse': { symbol: '💗', label: 'Growing Heart' },
    'sparkling_heart': { symbol: '💖', label: 'Sparkling Heart' },
    'cupid': { symbol: '💘', label: 'Heart with Arrow' },
    'gift_heart': { symbol: '💝', label: 'Heart with Ribbon' },
    'peace': { symbol: '☮️', label: 'Peace Symbol' },
    'latin_cross': { symbol: '✝️', label: 'Latin Cross' },
    'star_and_crescent': { symbol: '☪️', label: 'Star and Crescent' },
    'om': { symbol: '🕉️', label: 'Om' },
    'wheel_of_dharma': { symbol: '☸️', label: 'Wheel of Dharma' },
    'star_of_david': { symbol: '✡️', label: 'Star of David' },
    'six_pointed_star': { symbol: '🔯', label: 'Dotted Six-Pointed Star' },
    'menorah': { symbol: '🕎', label: 'Menorah' },
    'yin_yang': { symbol: '☯️', label: 'Yin Yang' },
    'orthodox_cross': { symbol: '☦️', label: 'Orthodox Cross' },
    'place_of_worship': { symbol: '🛐', label: 'Place of Worship' },
    'ophiuchus': { symbol: '⛎', label: 'Ophiuchus' },
    'aries': { symbol: '♈', label: 'Aries' },
    'taurus': { symbol: '♉', label: 'Taurus' },
    'gemini': { symbol: '♊', label: 'Gemini' },
    'cancer': { symbol: '♋', label: 'Cancer' },
    'leo': { symbol: '♌', label: 'Leo' },
    'virgo': { symbol: '♍', label: 'Virgo' },
    'libra': { symbol: '♎', label: 'Libra' },
    'scorpius': { symbol: '♏', label: 'Scorpio' },
    'sagittarius': { symbol: '♐', label: 'Sagittarius' },
    'capricorn': { symbol: '♑', label: 'Capricorn' },
    'aquarius': { symbol: '♒', label: 'Aquarius' },
    'pisces': { symbol: '♓', label: 'Pisces' },
    'id': { symbol: '🆔', label: 'ID Button' },
    'atom': { symbol: '⚛️', label: 'Atom Symbol' },
    'radioactive': { symbol: '☢️', label: 'Radioactive' },
    'biohazard': { symbol: '☣️', label: 'Biohazard' },
    'mobile_phone_off': { symbol: '📴', label: 'Mobile Phone Off' },
    'vibration_mode': { symbol: '📳', label: 'Vibration Mode' },
    'eight_pointed_black_star': { symbol: '✴️', label: 'Eight Pointed Star' },
    'vs': { symbol: '🆚', label: 'VS Button' },
    'white_flower': { symbol: '💮', label: 'White Flower' },
    'ideograph_advantage': { symbol: '🉐', label: 'Circle "De" Ideograph' },
    'secret': { symbol: '㊙️', label: 'Secret' },
    'congratulations': { symbol: '㊗️', label: 'Congratulations' },
    'a': { symbol: '🅰️', label: 'A Button (Blood Type)' },
    'b': { symbol: '🅱️', label: 'B Button (Blood Type)' },
    'ab': { symbol: '🆎', label: 'AB Button (Blood Type)' },
    'cl': { symbol: '🆑', label: 'CL Button' },
    'o2': { symbol: '🅾️', label: 'O Button (Blood Type)' },
    'sos': { symbol: '🆘', label: 'SOS Button' },
    'no_entry': { symbol: '⛔', label: 'No Entry' },
    'name_badge': { symbol: '📛', label: 'Name Badge' },
    'no_entry_sign': { symbol: '🚫', label: 'Prohibited' },
    'x': { symbol: '❌', label: 'Cross Mark' },
    'o': { symbol: '⭕', label: 'Hollow Red Circle' },
    'stop_sign': { symbol: '🛑', label: 'Stop Sign' },
    'anger': { symbol: '💢', label: 'Anger Symbol' },
    'hotsprings': { symbol: '♨️', label: 'Hot Springs' },
    'no_pedestrians': { symbol: '🚷', label: 'No Pedestrians' },
    'do_not_litter': { symbol: '🚯', label: 'No Littering' },
    'no_bicycles': { symbol: '🚳', label: 'No Bicycles' },
    'non-potable_water': { symbol: '🚱', label: 'Non-Potable Water' },
    'underage': { symbol: '🔞', label: 'No One Under 18' },
    'no_mobile_phones': { symbol: '📵', label: 'No Mobile Phones' },
    'exclamation': { symbol: '❗', label: 'Exclamation Mark' },
    'grey_exclamation': { symbol: '❕', label: 'White Exclamation Mark' },
    'question': { symbol: '❓', label: 'Question Mark' },
    'grey_question': { symbol: '❔', label: 'White Question Mark' },
    'bangbang': { symbol: '‼️', label: 'Double Exclamation Mark' },
    'interrobang': { symbol: '⁉️', label: 'Exclamation Question Mark' },
    'low_brightness': { symbol: '🔅', label: 'Dim Button' },
    'high_brightness': { symbol: '🔆', label: 'Bright Button' },
    'trident': { symbol: '🔱', label: 'Trident Emblem' },
    'fleur_de_lis': { symbol: '⚜️', label: 'Fleur-de-lis' },
    'part_alternation_mark': { symbol: '〽️', label: 'Part Alternation Mark' },
    'warning': { symbol: '⚠️', label: 'Warning' },
    'children_crossing': { symbol: '🚸', label: 'Children Crossing' },
    '🔰': { symbol: '🔰', label: 'Japanese Symbol for Beginner' },
    'recycle': { symbol: '♻️', label: 'Recycle Symbol' },
    'white_check_mark': { symbol: '✅', label: 'Check Mark Button' },
    'chart_with_upwards_trend_yen': { symbol: '💹', label: 'Chart with Upwards Trend' },
    'sparkle': { symbol: '❇️', label: 'Sparkle' },
    'eight_spoked_asterisk': { symbol: '✳️', label: 'Eight-Spoked Asterisk' },
    'negative_squared_cross_mark': { symbol: '❎', label: 'Cross Mark Button' },
    'globe_with_meridians': { symbol: '🌐', label: 'Globe with Meridians' },
    'm': { symbol: 'Ⓜ️', label: 'Circled M' },
    'diamond_shape_with_a_dot_inside': { symbol: '💠', label: 'Diamond with a Dot' },
    'cyclone': { symbol: '🌀', label: 'Cyclone' },
    'loop': { symbol: '➿', label: 'Double Curly Loop' },
    'zzz': { symbol: '💤', label: 'Zzz' },
    'atm': { symbol: '🏧', label: 'ATM Sign' },
    'restroom': { symbol: '🚻', label: 'Restroom' },
    'wheelchair': { symbol: '♿', label: 'Wheelchair Symbol' },
    'parking': { symbol: '🅿️', label: 'P Button' },
    'sa': { symbol: '🈂️', label: 'Japanese "Service Charge" Button' },
    'passport_control': { symbol: '🛂', label: 'Passport Control' },
    'customs': { symbol: '🛃', label: 'Customs' },
    'baggage_claim': { symbol: '🛄', label: 'Baggage Claim' },
    'left_luggage': { symbol: '🛅', label: 'Left Luggage' },
    'mens': { symbol: '🚹', label: 'Men\'s Room' },
    'womens': { symbol: '🚺', label: 'Women\'s Room' },
    'baby_symbol': { symbol: '🚼', label: 'Baby Symbol' },
    'water_closet': { symbol: '🚾', label: 'Water Closet' },
    'cinema': { symbol: '🎦', label: 'Cinema' },
    'antenna_bars': { symbol: '📶', label: 'Antenna Bars' },
    'koko': { symbol: '🈁', label: 'Japanese "Here" Button' },
    'ng': { symbol: '🆖', label: 'NG Button' },
    'ok': { symbol: '🆗', label: 'OK Button' },
    'up': { symbol: '🆙', label: 'UP! Button' },
    'cool': { symbol: '🆒', label: 'COOL Button' },
    'new': { symbol: '🆕', label: 'NEW Button' },
    'free': { symbol: '🆓', label: 'FREE Button' },
    'zero': { symbol: '0️⃣', label: 'Keycap: 0' },
    'one': { symbol: '1️⃣', label: 'Keycap: 1' },
    'two': { symbol: '2️⃣', label: 'Keycap: 2' },
    'three': { symbol: '3️⃣', label: 'Keycap: 3' },
    'four': { symbol: '4️⃣', label: 'Keycap: 4' },
    'five': { symbol: '5️⃣', label: 'Keycap: 5' },
    'six': { symbol: '6️⃣', label: 'Keycap: 6' },
    'seven': { symbol: '7️⃣', label: 'Keycap: 7' },
    'eight': { symbol: '8️⃣', label: 'Keycap: 8' },
    'nine': { symbol: '9️⃣', label: 'Keycap: 9' },
    'ten': { symbol: '🔟', label: 'Keycap: 10' },
    'arrow_forward': { symbol: '▶️', label: 'Play Button' },
    'pause_button': { symbol: '⏸️', label: 'Pause Button' },
    'play_or_pause_button': { symbol: '⏯️', label: 'Play or Pause Button' },
    'stop_button': { symbol: '⏹️', label: 'Stop Button' },
    'record_button': { symbol: '⏺️', label: 'Record Button' },
    'next_track_button': { symbol: '⏭️', label: 'Next Track Button' },
    'previous_track_button': { symbol: '⏮️', label: 'Last Track Button' },
    'fast_forward': { symbol: '⏩', label: 'Fast-Forward Button' },
    'rewind': { symbol: '⏪', label: 'Fast Reverse Button' },
    'twisted_rightwards_arrows': { symbol: '🔀', label: 'Shuffle Tracks Button' },
    'repeat': { symbol: '🔁', label: 'Repeat Button' },
    'repeat_one': { symbol: '🔂', label: 'Repeat Single Button' },
    'arrow_backward': { symbol: '◀️', label: 'Reverse Button' },
    'arrow_up_small': { symbol: '🔼', label: 'Up Button' },
    'arrow_down_small': { symbol: '🔽', label: 'Down Button' },
    'arrow_double_up': { symbol: '⏫', label: 'Fast Up Button' },
    'arrow_double_down': { symbol: '⏬', label: 'Fast Down Button' },
    'arrow_right': { symbol: '➡️', label: 'Right Arrow' },
    'arrow_left': { symbol: '⬅️', label: 'Left Arrow' },
    'arrow_up': { symbol: '⬆️', label: 'Up Arrow' },
    'arrow_down': { symbol: '⬇️', label: 'Down Arrow' },
    'arrow_upper_right': { symbol: '↗️', label: 'Up-Right Arrow' },
    'arrow_lower_right': { symbol: '↘️', label: 'Down-Right Arrow' },
    'arrow_lower_left': { symbol: '↙️', label: 'Down-Left Arrow' },
    'arrow_upper_left': { symbol: '↖️', label: 'Up-Left Arrow' },
    'arrow_up_down': { symbol: '↕️', label: 'Up-Down Arrow' },
    'left_right_arrow': { symbol: '↔️', label: 'Left-Right Arrow' },
    'arrows_counterclockwise': { symbol: '🔄', label: 'Counterclockwise Arrows Button' },
    'arrow_right_hook': { symbol: '↪️', label: 'Right Arrow Curving Left' },
    'leftwards_arrow_with_hook': { symbol: '↩️', label: 'Left Arrow Curving Right' },
    'arrow_heading_up': { symbol: '⤴️', label: 'Right Arrow Curving Up' },
    'arrow_heading_down': { symbol: '⤵️', label: 'Right Arrow Curving Down' },
    'hash': { symbol: '#️⃣', label: 'Keycap: #' },
    'asterisk': { symbol: '*️⃣', label: 'Keycap: *' },
    'information_source': { symbol: 'ℹ️', label: 'Information' },
    'abc': { symbol: '🔤', label: 'Input Latin Letters' },
    'abcd': { symbol: '🔡', label: 'Input Latin Lowercase' },
    'capital_abcd': { symbol: '🔠', label: 'Input Latin Uppercase' },
    'symbols': { symbol: '🔣', label: 'Input Symbols' },
    'musical_score': { symbol: '🎼', label: 'Musical Score' },
    'signal_strength': { symbol: '📶', label: 'Antenna Bars' },
}

// 8. Flags (Bandeiras) - Amostra
export const FLAGS: EmojiGroup = {
    'white_flag': { symbol: '🏳️', label: 'White Flag' },
    'black_flag': { symbol: '🏴', label: 'Black Flag' },
    'checkered_flag': { symbol: '🏁', label: 'Chequered Flag' },
    'triangular_flag_on_post': { symbol: '🚩', label: 'Triangular Flag' },
    'rainbow_flag': { symbol: '🏳️‍🌈', label: 'Rainbow Flag' },
    'transgender_flag': { symbol: '🏳️‍⚧️', label: 'Transgender Flag' },
    'pirate_flag': { symbol: '🏴‍☠️', label: 'Pirate Flag' },
    'br': { symbol: '🇧🇷', label: 'Flag: Brazil' },
    'us': { symbol: '🇺🇸', label: 'Flag: United States' },
    'jp': { symbol: '🇯🇵', label: 'Flag: Japan' },
    'de': { symbol: '🇩🇪', label: 'Flag: Germany' },
    'fr': { symbol: '🇫🇷', label: 'Flag: France' },
    'it': { symbol: '🇮🇹', label: 'Flag: Italy' },
    'es': { symbol: '🇪🇸', label: 'Flag: Spain' },
    'ru': { symbol: '🇷🇺', label: 'Flag: Russia' },
    'cn': { symbol: '🇨🇳', label: 'Flag: China' },
    'kr': { symbol: '🇰🇷', label: 'Flag: South Korea' },
    'gb': { symbol: '🇬🇧', label: 'Flag: United Kingdom' },
    'ca': { symbol: '🇨🇦', label: 'Flag: Canada' },
    'au': { symbol: '🇦🇺', label: 'Flag: Australia' },
    'in': { symbol: '🇮🇳', label: 'Flag: India' },
    'pt': { symbol: '🇵🇹', label: 'Flag: Portugal' },
}

// Map Principal (Combine All)
export const EMOJI_MAP: Record<string, { symbol: string; label: string }> = {
    ...SMILEYS_PEOPLE,
    ...ANIMALS_NATURE,
    ...FOOD_DRINK,
    ...ACTIVITIES,
    ...TRAVEL_PLACES,
    ...OBJECTS,
    ...SYMBOLS,
    ...FLAGS,
}

export type EmojiName = keyof typeof EMOJI_MAP

