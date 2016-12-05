function GD_CreateMsg (indexLang, idMsg, txtMsg) {
	
	if (indexLang != 1) return
	
	var line = ""
	line += "\t\"" + "messages."+ idMsg + ".txt\": {\n" ;
	line += "\t\t\"" + "message\": \"" + txtMsg + "\"\n" ;
	line += "\t}";
	console.log(line);
}

GD_CreateMsg (1, "nadie_sale_a_recibirte", "Después de esperar un rato, ves que nadie sale a recibirte. Estarán fuera o muy ocupados.<br/>"); 
GD_CreateMsg (1, "DLG_ya_estoy_aquí", "Ya estoy aquí, ¿para qué me llamas?");
GD_CreateMsg (1, "sabes_que_no_te_abrirá", "Tocas el timbre, ves encenderse una luz sobre la cámara... pero sabes que después de la última fiesta salvaje Charlie no te va a abrir durante un tiempo.<br/><br/>"); 
GD_CreateMsg (1, "te_observan_por_cámara", "Notas cómo se enciende la luz de la cámara de seguridad y te observan unos segundos. Al final escuchas:<br/>"); 
GD_CreateMsg (1, "DLG_welcome_whisky", "¡Mi hermano!, ¡qué bueno que vienes con provisiones! Entra, muchacho, bienvenido a nuestra humilde morada.");
GD_CreateMsg (1, "fiestón", "<br/><br/>¿En qué momento se te ocurrió meterte en este lío? Al pasar por la puerta, el olor a marihuana te hace sentirte en casa y te acuerdas de tu plantita del estudio. Música a todo meter, gente guapa y mucha alegría. Con una sonrisa de oreja a oreja hablas entre gritos acerca tu nueva novela con unos perfectos desconocidos que te han adoptado como parte de su grupo. Uno de ellos te habla de ruidos y sucesos misteriosos ocurridos en tu casa: \'solemos entrar de okupas en las casas abandonadas durante mucho tiempo, ¿por qué crees que hemos respetado la tuya?\'<br/><br/>De madrugada te atreves a lanzar tu pregunta sobre si hay alguien que tenga setas alucinógenas, para \'documentarte\' en una cosa que escribes. El colega de un colega llama a un colega y a la media hora estás probando las setas. Menos mal que alcanzas a esconder unas en tu chaqueta antes de... perder la conciencia. Vagamente sientes que alguien te lleva a tu casa, pero es casi más un sueño que algo de lo que estés seguro.<br/><br/>"); 
GD_CreateMsg (1, "DLG_donde_whisky", "Mi hermano, ¿dónde está el whisky? Creo que te has equivocado de fiesta.");
GD_CreateMsg (1, "%o1_aparece", "%o1 aparece.");
GD_CreateMsg (1, "escribes_en_estudio", "Eres un obseso de la literatura, empiezas retocando una cosita de tu manuscrito y cuando te das cuenta, ya llevas más de una hora con la revisión.<br/>"); 
GD_CreateMsg (1, "sitio_incorrecto_escribir", "Por comodidad no considerar oportuno escribir en otro sitio que no sea en el escritorio de tu antigua habitación.<br/>"); 
GD_CreateMsg (1, "ya_escribiste_por_hoy", "Ya dedicaste tu ración diaria de escritura. Como tu conciencia está libre para hacer otras cosas, apartas el manuscrito a un lado.<br/>"); 
GD_CreateMsg (1, "Sesión_escritura", "Te sientas en el escritorio y después de unos momentos de duda, coges carrerilla y cuando te das cuentas ha pasado más de una hora, tiempo en el que reescribes algunas partes de tu nueva novela.<br/>"); 
GD_CreateMsg (1, "comesTelePapeo", "Es aburrida comida basura, pero tu prioridad en estos días no es comer bien.<br/><br/>"); 
GD_CreateMsg (1, "comesTelePapeoVacío", "Desconsolado, miras las restos que quedan, pero poco más.<br/><br/>"); 
GD_CreateMsg (1, "sueño", "No puedes respirar, estás encerrado en la cueva de la playa y no puedes escapar. De repente, un corrimiento de arena de la playa entra en la cueva y te cubre hasta la cintura y no puedes moverte. En tus manos tienes el collar de conchas marinas que has hecho para regalárselas a tu querido hermano...<br/>Pero no, no puede ser, estos no son recuerdos tuyos, sólo pueden ser los últimos recuerdos de ella, del día en que...<br/>Despiertas, mojado en sudor.<br/><br/>Te levantas, no crees que vayas a poder reconciliar el sueño. De hecho, temes volver a dormir y volver a vivir esa horrible experiencia.<br/><br/>"); 
GD_CreateMsg (1, "sueño_en_estudio", "Tienes la maleta casi preparada para el viaje de vuelta a la vieja casa familiar, en la costa. Sólo te hace falta meter un par de cosas más y podrás emprender ese viaje que llevas retrasando ya quince años.<br/>Deberías salir de casa antes de las 13:00 para no perder el avión.<br/>Has terminado el primer borrador de tu nueva novela y crees que la vieja casa te dará la tranquilidad necesaria para terminarla, lejos del ruido y las obligaciones de la ciudad.<br/><br/>"); 
GD_CreateMsg (1, "perder_tiempo", "La cosa no está como para derrochar el tiempo, pero una cabezadita nunca viene mal... ZZZ.<br/>"); 
GD_CreateMsg (1, "no_dejar_meter_en_chimenea", "Podría ser interesante hacer que arda... pero no en esta ocasión.<br/>"); 
GD_CreateMsg (1, "no_dejar_meter_foto2_en_chimenea", "Recuerdas que el libro arcano muestra una imagen de una madre con sus dos hijos.<br/>"); 
GD_CreateMsg (1, "sin_motivo_para_dejar_meter_en_chimenea", "No ves el motivo para meter eso en la chimenea.<br/>"); 
GD_CreateMsg (1, "fantasma_asiente_cuando_metes_en_chimenea", "Una espantosa voz que viene de todos lados y ninguno grita un \'¡sí!\'.<br/>"); 
GD_CreateMsg (1, "meter_o1_mientras_se_carga_móvil", "¿Meter %o1 mientras el móvil se carga? Va a ser que no.<br/>"); 
GD_CreateMsg (1, "atar_cinturón_en_cuevita", "Desde aquí no alcanzas los barrotes, deberás atar el cinturón desde fuera.<br/>"); 
GD_CreateMsg (1, "atar_cinturón_barrotes_bajo_agua", "Los barrotes están bajo el agua y no consigues atar el cinturón, tendrás que esperar a que baje la marea.<br/>"); 
GD_CreateMsg (1, "atas_cinturón", "Atas el cinturón a los barrotes de la entrada a la cueva.<br/>"); 
GD_CreateMsg (1, "desatar_cinturón_en_cuevita", "Desde aquí no alcanzas los barrotes, deberás desatar el cinturón desde fuera.<br/>"); 
GD_CreateMsg (1, "desatar_cinturón_barrotes_bajo_agua", "Los barrotes están bajo el agua y no consigues desatar el cinturón, tendrás que esperar a que baje la marea.<br/>"); 
GD_CreateMsg (1, "desatas_cinturón", "Desatas el cinturón de los barrotes de la entrada a la cueva.<br/>"); 
GD_CreateMsg (1, "coges_collar", "Aparece un collar de conchas como el de tu sueño. No puedes evitar llorar mientras lo acaricias. No puedes explicarlo, pero notas a Ana cerca de ti, como si ella estuviera contigo ahora.<br/>"); 
GD_CreateMsg (1, "antisocial", "Por ahora estás muy centrado en tu libro como para hacer vida social, así que al final no lo haces.<br/>"); 
GD_CreateMsg (1, "nomobofia", "Cuando vas a dejarlo, te entra tu habitual ataque de nomobofia y no lo sueltas.<br/>"); 
GD_CreateMsg (1, "no_dejas_collar", "No te sientes capaz de soltar el collar que te hizo tu querida hermana antes de morir.<br/>"); 
GD_CreateMsg (1, "no_dejas_nada_en_cueva", "Mejor no dejar nada en la cueva, no vaya a ser que suba la marea y lo pierdas.<br/>"); 
GD_CreateMsg (1, "sin_baterías", "Las baterías están gastadas. Tendrías que recargarlo primero.<br/>"); 
GD_CreateMsg (1, "llamar_desde_estudio", "Ves que en la agenda aparece Freddie, tu vecino de al lado, pero por ahora no ves la necesidad de llamarlo.<br/>"); 
GD_CreateMsg (1, "llamar_a_quien", "¿A quién quieres llamar?<br/>"); 
GD_CreateMsg (1, "cancelar_acción", "Cancelar la acción"); 
GD_CreateMsg (1, "llamar_a_Freddie", "Freddie"); 
GD_CreateMsg (1, "llamar_a_TelePapeo", "TelePapeo"); 
GD_CreateMsg (1, "llamar_a_Charlie", "Charlie"); 
GD_CreateMsg (1, "llamar_a_Vicky", "Vicky"); 
GD_CreateMsg (1, "no_llamas", "Al final no llamas a nadie"); 
GD_CreateMsg (1, "llamas_a_s1_y_cuelgas", "Llamas a %s1 y cuelgas.<br/>"); 
GD_CreateMsg (1, "sin_baterías", "Las baterías están gastadas. Tendrías que recargarlo primero.<br/>"); 
GD_CreateMsg (1, "recuerdas_hora_avión", "Recuerdas que deberías salir antes de las 13:00 para el aeropuerto o perderás el avión que te lleva a la costa.<br/>"); 
GD_CreateMsg (1, "son_las_s1_s2", "Son las %s1:%s2."); 
GD_CreateMsg (1, "batería_restante_s1_s2", " Tiempo restante de batería: %s1h%s2m."); 
GD_CreateMsg (1, "linterna_encendida", " Linterna encendida."); 
GD_CreateMsg (1, "sin_baterías", "Las baterías están gastadas. Tendrías que recargarlo primero.<br/>"); 
GD_CreateMsg (1, "bajamar_ahora_durante_s1", "La máxima marea baja está siendo ahora y acabará dentro de %s1 minutos.<br/>"); 
GD_CreateMsg (1, "próxima_bajamar_s1_s2", "La próxima marea baja será a las %s1:%s2.<br/>"); 
GD_CreateMsg (1, "móvil_cargándose", "Se está cargando ahora.<br/>");
GD_CreateMsg (1, "baterías_móvil_llenas", "Las baterías están llenas.<br/>");
GD_CreateMsg (1, "enciendes_linterna", "Enciendes la linterna del móvil.<br/>"); 
GD_CreateMsg (1, "apagas_linterna", "Apagas linterna del móvil<br/>"); 
GD_CreateMsg (1, "sin_enchufe", "Aquí no hay ningún enchufe donde cargarlo.<br/>");
GD_CreateMsg (1, "lo_pones_a_cargar", "Pones el móvil a cargar, a ver si no tarda mucho.<br/>");
GD_CreateMsg (1, "retiras_cargador", "Retiras el cargador del móvil.<br/>");
GD_CreateMsg (1, "no_puedes_salir_mientras_carga", "Intentas moverte... pero ni te separas de tu móvil mientras se está cargando.<br/>");
GD_CreateMsg (1, "no_puedes_sacar_maleta_de_casa", "Cuando  te diriges afuera, te sientes un poco ridículo llevando la maleta contigo, así que la dejas antes de salir.<br/>");
GD_CreateMsg (1, "no_puedes_sacar_manuscrito_de_casa", "¿Salir de casa con tu valioso manuscrito? Sólo tienes una copia y no te arriesgas a perderlo. Lo dejas en casa antes de salir.<br/>");
GD_CreateMsg (1, "fantasma_no_te_deja_ir", "Tu querida hermana no te permite ir en esa dirección.<br/>");
GD_CreateMsg (1, "te_despeñas", "<br/><br/>En la noche avanzas siguiendo la voluntad de tu hermana. Al llegar al lugar de las dos lápidas, ves cómo una niebla sale de la tumba de tu madre y se reúne con la figura de tu querida hermana. Ambas te llaman con los brazos abiertos. Caminas hacia ellas como hipnotizado... y de repente sientes que no hay suelo bajo tus pies. Mientras caes, dos luces te acompañan en la caída. Luego, una tercera luz, tú, se reúne con ellas y avanzan juntas hacia un círculo de luz en el horizonte.<br/><br/>")
GD_CreateMsg (1, "fin_juego_despeñas", "El juego ha terminado. ¿Qué habría pasado si hubieras ido a la cueva en vez de al promontorio?<hr/>")
GD_CreateMsg (1, "no_te_olvides_móvil", "¿Irte sin el móvil? Eres un poco rarito y no vas a la última... pero no tanto.<br/>");
GD_CreateMsg (1, "no_te_olvides_maleta", "¿Irte de viaje sin  maleta? Eres un poco olvidadizo y despistado, me temo.<br/>");
GD_CreateMsg (1, "cosas_en_mano", "Te piensas salir con las manos tan llenas. Salvo el móvil, sabes que irías más cómodo si llevas el resto de cosas en la maleta.<br/>");
GD_CreateMsg (1, "no_te_lleves_planta", "¿Para qué demonios te quieres llevar la planta de viaje?<br/>");
GD_CreateMsg (1, "no_te_olvides_novela", "Se supone que te vas unas semanas a la casa de la playa a terminar tu NO-VE-LA... ¿no crees que te olvidas algo?<br/>");
GD_CreateMsg (1, "te_olvidas_algo", "Igual te has olvidado de coger algo, pero esás ansioso por partir.");
GD_CreateMsg (1, "cierras_maleta", "Cierras la maleta y sales del estudio.<br/><br/>");
GD_CreateMsg (1, "al_salir_del_estudio_1", "El viaje transcurre como en un sueño. Un momento atrás estabas en tu estudio...y ahora, ahí estás delante de la puerta de la casa de la playa. Los trayectos de taxi, el bullicio del aeropuerto, el ronquido del pasajero de al lado... a nada de eso le has prestado demasiada atención. En tu cabeza sólo había una idea 'en un rato volveré a estar allí donde todo ocurrió, después de hace tantos años'. Al supuesto motivo por el que vas, acabar las correcciones de tu última novela, tampoco le has dedicado ni un pensamiento.<br/><br/>");
GD_CreateMsg (1, "al_salir_del_estudio_2", "Sólo puedes pensar en cómo eran las cosas antes de la muerte de Ana, tu querida hermana gemela, la niña de tus ojos. Recuerdas en especial lo felices que fuisteis juntos aquel último verano. Pasabais casi más tiempo en la caleta de detrás de la casa que dentro de la misma. Vuestra madre siempre tenía que ir a buscaros cuando empezaba a oscurecer. Esa misma caleta infame donde ocurrió la tragedia.<br/><br/>");
GD_CreateMsg (1, "primera_vez_salón_comedor", "<b>Entras.</b><br/><br/>El salón comedor está casi igual que hace quince años, si exceptuamos el polvo acumulado. Retiras las sábanas y las sacudes fuera. Ahora sí, el salón luce casi como antes. Entre diversos planfletos bajo la puerta, te llama la atención uno de comida a domicilio, TelePapeo, que no te vendrá mal estos días.<br/>");
GD_CreateMsg (1, "promontorio_sin_luz", "A oscuras, no te atreves a moverte ni un paso por miedo a despeñarte, como le pasó a tu madre.<br/>"); 
GD_CreateMsg (1, "camino_playa_sin_luz_a_o1", "A oscuras, caminas sin tino y llegas sin saber como a... %o1<br/>"); 
GD_CreateMsg (1, "caleta_sin_luz_a_camino_playa", "A oscuras, comienzar a subir a tientas un promontorio, pero resbalas y vuelves a donde estabas.<br/>"); 
GD_CreateMsg (1, "entras_cueva_con_fanstasma", "Con un inefable sensación de fatídica desgracia entras en la cueva, seguido por tu querida hermana.<br/>"); 
GD_CreateMsg (1, "cueva_no_accesible", "La pequeña cueva ahora está cubierta por el mar. Tendrás que esperar a la próxima marea baja.<br/>"); 
GD_CreateMsg (1, "cueva_innaccesible", "Los barrotes te impiden entrar en la cuevita.<br/>");
GD_CreateMsg (1, "entrar_sin_linterna", "Está muy oscuro ahí dentro. Como sin luz no verías nada sería tontería entrar ahora.<br/>"); 
GD_CreateMsg (1, "entras_sin_cinturon_atado", "Entras con mucha precaución, atemorizado por lo que le pasó a tu hermana aquí. Seguramente no es una buena idea entrar sin una cuerda o similar atada a los barrotes, por si acaso.<br/>");
GD_CreateMsg (1, "primera_vez_cuevita", "Te cuesta respirar, aquí fue donde ella murió ahogada. Nadie sabe muy bien por qué permaneció tanto tiempo dentro y fue sorprendida por la marea y el corrimiento de tierra que precipitó la area de la pequeña duna dentro de la cueva.<br/>En el suelo puedes ver lo que parece ser una cuerda semienterrada<br/>");
GD_CreateMsg (1, "primera_vez_caleta", "Avanzas casi arrastrando los pies. No quieres ir, pero no puedes evitarlo. Sabes que tienes que hacer frente al pasado, ya han pasado más de quince años y tienes que superarlo.<br/>");
GD_CreateMsg (1, "debes_dejar_cinturón", "No puedes irte con el cinturón atado a los barrores. Lo desatas y te lo llevas contigo.<br/>");
GD_CreateMsg (1, "telepapeo_en_agenda", "Añades el teléfono de la tienda TelePapeo en tu agenda del móvil.<br/>");
GD_CreateMsg (1, "ex_barrotes_marea_alta", "Con la marea alta apenas ves unos hierros oxidados bajo el agua. Se pusieron para sellar la entrada a la cueva donde Ana..., cuando la marea está baja.<br/>");
GD_CreateMsg (1, "CestaTelePapeo_vacía", "La cesta de TelePapeo está vacía.<br/>");
GD_CreateMsg (1, "contenidoCestaTelePapeo", "La cesta de TelePapeo contiene:<br/>");
GD_CreateMsg (1, "TelePapeo_ver_prod_s1", "%s1<br/>" ); 
GD_CreateMsg (1, "ex_libro_magia_general", "Las macabras ilustraciones de este libro antiquísimo escrito en un idioma que desconoces te fascina de manera enfermiza. Te ha dado muchas ideas para escribir tus cuentos y novelas.<br/>" ); 
GD_CreateMsg (1, "ex_libro_magia_embarazada", "Ahí está la ilustración que buscabas. Parece ser un ritual para que dos almas separadas por la muerte vuelvan a encontrarse en el cuerpo de una mujer embarazada de gemelos. Ves cómo el gemelo difunto le da un regalo al superviviente, que lo sujeta en una mano mientras que con otra prende fuego a una tela con la sangre de la mujer embarazada y a una ofrenda valiosa del gemelo vivo. Como colofón, se ve al gemelo vivo comiendo algo parecido a setas alucinógenas mientras ver arder el fuego ante él.<br/>" ); 
GD_CreateMsg (1, "duda_embarazada_gemelos", "Un sombío presentimiento te viene a la cabeza: ¿estará Vicky embarazada de gemelos?<br/>" ); 
GD_CreateMsg (1, "duda_embarazada_gemelos_confirmada", "Algo irrefrenable te anima a seguir adelante con el hechizo, aunque sólo sea para confirmar que no son más que supersticiones sin sentido.<br/>" ); 
GD_CreateMsg (1, "ex_libro_magia_hechizo2", "ex_libro_magia_hechizo2<br/>" ); 
GD_CreateMsg (1, "ex_libro_completo", "El libro no parece tener nada interesante que ofrecerte ahora.<br/>" ); 
GD_CreateMsg (1, "aparece_diario", "Al apoyarte en el colchón para ver cómo está la cama, oyes un ruido de algo que cae al suelo debajo de la cama.<br/>" ); 
GD_CreateMsg (1, "aparece_foto3", "Entre otras cosas, aparece una foto de tu madre con tu hermana y contigo.<br/>" ); 
GD_CreateMsg (1, "espejo_0", "Por un momento, te parece ver a tu hermana cogida de tu mano al lado tuya. Sientes la mano fría y te la frotas para recuperar el calor.<br/>" ); 
GD_CreateMsg (1, "espejo_1", "Se te nubla la vista y te ves tal como eras de pequeño. Oyes una vocetia que entre risas te dice \'¡Al!¡Estoy escondida, ven a buscarme, apúrate!\'<br/>" ); 
GD_CreateMsg (1, "espejo_2", "Te ves rodeado de un aura de fuego que te cubre. Instintívamente, te pasas las manos por la cabeza, que te notas más cliente de lo normal.<br/>" ); 
GD_CreateMsg (1, "espejo_3", "El espejo refleja la ventana abierta, a través de la que puede ver el lejano promontorio. Tiemblas al recordar no sólo que los cuerpo de tu querida hermana y tu madre están ahí, sino que ésta última falleció al caer desde ahí.<br/>" ); 
GD_CreateMsg (1, "espejo_4", "Por un segundo, te viene una imagen de tu recurrente pesadilla. Te ves a ti mismo cubierto del mar y ahogándote en la cueva.<br/>" ); 
GD_CreateMsg (1, "pulsa_para_ver_imagen_de_%o1", "Pulsa para ver imagen de %o1.<br/>");
GD_CreateMsg (1, "falta_atizador", "Los barrotes están muy oxidados y se mueven, pero te convences de que con las manos sólo no vas a poder retirarlos.<br/>");
GD_CreateMsg (1, "rompes_barrotes", "Gracias al atizador, rompes los barrotes con facilidad, pudiendo ahora entrar en la cuevita.<br/>");
GD_CreateMsg (1, "no_es_necesario_que_insistas", "No es necesario que insistas.<br/>");
GD_CreateMsg (1, "rompes_collar", "Tus lágimas se diluyen en el mar, que te cubre por completo. Cuando ya casi no puedes seguir respirando pones todas tus energías en romper el collar, en un intento desesperado de romper el nexo con tu querida hermana. Te hieres las manos, pero al final rompes la cuerda y las conchas que formaban el collar se dispersan por la corriente en todas direcciones.<br/>Entonces sucede lo inesperado. Aparentemente, ese collar mantenía encadenada a tu hermana a ti y al mundo de los mortales. Una vez roto el collar, toda la rabia de tu querida hermana desaparece y es sustituida por una gran paz y una bella sonrisa. Su cuerpo respandece y te guía en la oscuridad hasta la salida de la cueva.<br>Apareces de noche en la pequeña caleta. Tu querida hermana se despide de ti y se diríge a un círculo de luz.<br/><br/>");
GD_CreateMsg (1, "estadística_juego_s1_s2_s3", "Has necesitado %s1 días y %s2:%s3 horas para despedirte de tu querida hermana.<br/><br/>")
GD_CreateMsg (1, "epílogo", "<b>Epílogo</b><br/><br/>Días después, organizas una fiesta en la casa de la playa. Asisten Freddie, Vicky con su marido, así como Charlie con varios amigos suyos. Después de comer, beber (y, algunos, fumarse lo que queda de tu planta que ha traído Freddie) en abundancia, les anuncias que estos días en la casa te han hecho renacer, que has quemado tu novela casi acabada y has empezado a escribir una nueva novela.<br/><br/>")
GD_CreateMsg (1, "DLG_presentación_poema", "Amigos, permitidme leeros este poemita que se me ocurrió ayer, que es en esencia una continuación del poema de Edgan Allan Poe \'Annabelle Lee\' y que creo que va a  jugar un papel importante en mi nueva novela:")
GD_CreateMsg (1, "fin_juego_poema", "El juego ha terminado<hr/>")
GD_CreateMsg (1, "no_rompes_collas", "¿Cómo romper algo tan bello que te hizo tu querida hermana el día de su muerte? El sólo hecho de pensarlo te entistrece y te hace soltar lágimas de dolor y pena.<br/>");
GD_CreateMsg (1, "no_gastar_cerillas", "Haces el amago de encender una, pero te das cuenta de que sólo la estarías desaprovechando aquí.<br/>");
GD_CreateMsg (1, "sin_cerillas", "No ves nada alrededor con qué encender la chimenea.<br/>");
GD_CreateMsg (1, "escena_hechizo1", "Te comes las setas y con mano temblorosa enciendes la cerilla y la acercas a la chimenea. Ahí descansan las páginas del manuscrito de tu novela, que te ha llevado cuatro años de tu vid: ¿qué mayor sacrificio que este para realizar el hechizo del libro arcano? Te sientes muy estúpido, ¿y si todo esto es una tontería y simplemente estás quemando tu trabajo por nada?<br/><br/>Pero no puedes resistirte, notas como las setas te han dejado la conciencia alterada y una sombra de la habitación adquiere la forma de tu hermana, que se acerca a ti y te hace un gesto para que acabes de acercar la cerilla a la chimenea.<br/><br/>Te has tenido que volver loco, porque ahora ves volando por el aire las tijeras de la cocina. Ahora sabes qué va a pasar, el hechizo exigirá tu muerte para que puedas renacer con tu querida hermana en el vientre de Vicky.<br/>Tienes muchas ganas de completar el hechizo y reunirte con tu querida hermana, pero... ¡tienes tantas cosas que hacer aún en esta vida!: publicar tu novela, ser padre, viajar... Antes de acercar irremisiblemente la cerilla a la chimenea el apego a la vida te da la oportunidad de no seguir el camino que te marca tu querida hermana.<br/>");
GD_CreateMsg (1, "apagar_cerilla", "Apagar la cerilla"); 
GD_CreateMsg (1, "encender_hoguera", "Encender la hoguera y completar el hechizo"); 
GD_CreateMsg (1, "hechizo1_abortado", "Con apenas fuerzas, soplas la cerilla. Tu querida hermana te mira con rabia y luego dirige su atención a las tijeras, que salen disparadas hacia ti y que sólo esquivas por los pelos.<br/><br/>La caja de cerillas sale volando de tus manos y ves ante tus ojos cómo se abre y se enciende una cerrilla por sí sola y prende fuego a la chimenea. ¡No! De manera instintiva intentas sacar tu manuscrito de las llamas, pero ya es demasiado tarde.<br/><br/>Pero ése no es suficiente sacrificio para tu hermana, que se sitúa entre la entrada de la casa y las escalera bloqueando tu salida y te señala hacia la cocina y la salida posterior de la casa.<br><br/>"); 
GD_CreateMsg (1, "fantasma_rompe_móvil", "Al verte dudar, tu querida hermana se enfuerece aún más y vuelve a lanzarte las tijeras, que dan de pleno en tu pecho... justo donde llevabas tu flamante móvil. Nunca creíste que llegaras alegrarte de sentir cómo se rompía su pantalla en mil pedazos.<br>"); 
GD_CreateMsg (1, "hechizo1_ejecutado", "Con apenas fuerzas, acercas la cerilla a la chimenea, mientra las tijeras vuelan por el aire y se clavan en tu cuello. Caes al suelo, desde donde ves quemarse tu vida. Tu manuscrito arde mientras notas que tu alma sale de tu cuerpo. Al lado tuyo están ahora las figuras de tu madre y tu querida hermana. Vuestra madre se dirige a un círculo de luz mientras que tú y tu querida hermana volaís hasta la habitación de Vicky. Ella duerme plácidamente abrazada a su marido. Notas cómo entráis en su vientre.<br/><br/>Dentro de Vicky, uno de los gemelos, la niña, sonríe, mientras que tú, en tu último pensamiento antes de perder la memoria, dudas de si esto era lo que realmente querías o has sido sólo el títere de su hermana. Después de ese momento, oscuridad y espera. Tu querida hermana te da la mano, volvéis a estar juntos.<br/><br/>");
GD_CreateMsg (1, "fin_juego_chimenea", "Este juego ha terminado, pero... ¿que habría pasado si no hubieras encendido la chimenea?<hr/>")
GD_CreateMsg (1, "fantasma_apaga_cerilla", "Enciendes una cerilla, y cuando vas a prender fuego a la chimenea, notas una corriente de aire extraña que la apaga. Se te herizan los pelos al escuchar una corriente de aire que te recuerda a tu querida hermana cuando jugaba a ser un fantasma.<br/>");
GD_CreateMsg (1, "tiempo_dedicado_s1", "Hoy le has dedicado %s1 horas de las 6 mínimas diarias que te marcaste.");
GD_CreateMsg (1, "desatas_cinturón_con_marea", "Desatas el cinturón de los barrotes antes de que suba más la marea.<br/>");
GD_CreateMsg (1, "desconectar_cargador", "Desconectas el cargador del móvil.<br/>");
GD_CreateMsg (1, "perdiste_avión", "Ni tú mismo te puedes creer que hayas perdido el avión. Menos mal que no será por vuelos. Llamas a la compañía aérea y reservas otro para la misma hora para mañana. Te pones a trabajar en tu nuevo libro y al llegar la noche comes algo y te vas a la cama. Mañana será otro día... aunque temes la noche y las pesadillas que trae consigo.<br/><br/>");
GD_CreateMsg (1, "dejarlo_todo_y_escribir", "Te das cuenta de que no has cumplido con tu compromiso de seis horas diarias de revisión diaria de tu novela. Lo dejas todo y te diriges a tu habitación a cumplir con tu deber.<br/>");
GD_CreateMsg (1, "el_remordimiento_te_corroe", "Peor aún, te das cuenta de que no podrás cumplir con tu compromiso al no saber cómo volver a casa.<br/>");
GD_CreateMsg (1, "a_dormir_después_de_escribir", "Acabas exhausto después de la sesión de revisión de tu novela. Comes algo y te acuestas.<br/>");
GD_CreateMsg (1, "a_dormir", "<br/>De repente, te das cuenta de qué hora es. Eres muy escrupuloso con tus horarios y a las 23:00 te retiras a casa a dormir, sí o sí. El sueño te vence y te arrastras a la cama. Mañana será otro día.<br/><br/>");
GD_CreateMsg (1, "de_noche_sin_luz", "Es de noche y estás fuera de casa sin iluminación que te guíe.<br/><br/>");
GD_CreateMsg (1, "tirado_en_la_calle", "De noche, en la calle y sin luz. Te haces un ovillo en cualquier lugar y duermes algo tullido de frío hasta que sale el sol.<br/><br/>");
GD_CreateMsg (1, "antes_dormir_cargas_móvil", "Antes de dormir, estiras el brazo y pones el móvil a cargar.<br/>");
GD_CreateMsg (1, "antes_dormir_NO_cargas_móvil", "Antes de dormir, estiras el brazo, pero el cargador no está... bueno, ya lo buscarás mañana.<br/>");
GD_CreateMsg (1, "día_s1", "<br/>Con energías renovadas comienzas la jornada %s1 desde que tuviste la pesadilla por primera vez.<br/><br/>");
GD_CreateMsg (1, "recibes_paquete", "<br/>¡Hoy seguro que recibiste el paquete de Freddie! Te diriges a la puerta de la casa, sacas todo el contenido del paquete y lo dejas en el salón comedor.<br/>");
GD_CreateMsg (1, "baterías_0", "Te has quedado sin baterías. Te toca apañártelas a la antigua usanza.<br/>");
GD_CreateMsg (1, "baterías_60", "Te estás quedando sin baterías. Te queda una hora a ritmo normal.<br/>");
GD_CreateMsg (1, "baterías_120", "Te estás quedando sin baterías. Te quedan menos de dos horas a ritmo normal.<br/>");
GD_CreateMsg (1, "estrofa1", "<br/><br/>De niño pasaba con mi familia<br/>los veranos en una casa junto al mar.<br/>Tenía yo una guapa vecina<br/>cuyo nombre no voy a mencionar<br/>de la que era novio infantil en verano<br/>y a quien el resto del año sólo podía añorar.<br/><br/>");
GD_CreateMsg (1, "estrofa2", "Un desgraciado verano,<br/>mi querido amor me fue arrebatado por un golpe de mar<br/>y quedé profundamente conmocionado.<br/>Su tumba iba a visitar <br/>todos los días, ese verano y los siguientes,<br/>en un promontorio junto al mar.<br/><br/>");
GD_CreateMsg (1, "estrofa3", "Quince años sin ella<br/>no me pudieron calmar.<br/>Entonces algo sucedió<br/>y me dejaron de mirar<br/>sus ojos reflejados en las estrellas.<br/>Sólo escribir me podía aliviar<br/>y con letras y más letras<br/>no la dejaba de llamar.<br/><br/>");
GD_CreateMsg (1, "estrofa4", "En otros ojos y cuerpos<br/>la quise buscar<br/>tanto de ángeles como de demonios.<br/>Pero nunca la pude encontrar<br/>Tanta fue mi desesperación<br/>que casi la llegué a olvidar.<br/><br/>");
GD_CreateMsg (1, "estrofa5", "Un día alguien tuvo a bien<br/>una bonita carta quererme enviar.<br/>Era una admiradora a quien en edad podría yo doblar.<br/>Había leído algo mío<br/>que de ella y de mí parecía hablar.<br/>Pero nunca pudimos vernos.<br/>Porque vivía ella lejos de mi casa junto al mar.<br/><br/>");
GD_CreateMsg (1, "estrofa6", "Un día, mientras firmaba libros en la ciudad,<br/>A una dulce voz oí rogar<br/>'Me firma, por favor.'<br/>Y al la vista levantar,<br/>los ojos de ella reencontré<br/>Aquellos mismos a quienes tanto amé.<br/>Y fui afortunado de nunca más volverme a separar<br/>de aquellos ojos de más allá de cielo y del mar.<br/><br/>");
GD_CreateMsg (1, "DLG_hippie_se_presenta", "¡Hola!, ¿qué puedo hacer por usted?... pero espera, ¡tú eres Al, mi viejo amigo de aventuras veraniegas! ¡Cómo me alegro de verte después de tantos años! Yo sigo aquí, con mi música y mi surf... a propósito, mira que app más guapa para saber a qué hora son las mareas")
GD_CreateMsg (1, "hippie_app_mareas_móvil_cargado",  "Te coge tu móvil y te la instala sin más.<br/>")
GD_CreateMsg (1, "hippie_app_mareas_presta_cargador",  "Te coge tu móvil y al ver que lo tienes sin baterías, entra en casa con tu móvil y vuelve con el móvil con un poco de carga y la app de mareas instalada.")
GD_CreateMsg (1, "DLG_hippie_invita_a_fiesta", "Colega, pásate por casa a partir de las 7 de le noche. Casi siempre hay gente, sexo, drogas y rockandroll a partir de esa hora. Ja, ja, ja. Tráete algo de bebida y yo me encargo del resto. Tengo género de buena calidad.")
GD_CreateMsg (1, "hippie_se_despide", "<br/>Sin darte mucho margen, tu amigo de la infancia se mete en casa («a dormir la mona», dice), no sin antes dejarte su número de móvil.<br/>"); 
GD_CreateMsg (1, "sobre_mareas_y_cuevas", "<br/>Una oscura reflexión te nubla la mente. Te acabas de acordar de la época del año en la que estamos, aproximadamente la misma en que ella... ¿Como no te habías dado cuenta antes? Las mareas surferas de Charlie te lo acaban de recordar. Es época de mareas largas, permitiendo que la fatídica cuevita de la playa quede al descubierto cuando está baja. El resto del año la cueva queda siempre bajo el nivel del mar, sin riesgo de que a ningún niño le pueda pasar lo que a ella.<br/>"); 
GD_CreateMsg (1, "DLG_embarazada_se_presenta", "¡Al!» Sin darte tiempo a reaccionar una corpulenta mujer embarazada se abalanza encima tuya y te da cuatro besos.«¡Qué alegría más grande! ¿Vas a estar mucho?, ¿unas semanas tal vez?, ¡qué bueeeno! Paso mucho tiempo sola en casa por las mañanas, hasta eso de la hora del té, que es cuando regresa de trabajar mi marido. Apunta mi número de móvil: llámame e invítame a tu casa a comerme un helado de chocolate. ¡Estos días sólo pienso en comer chocolate!")
GD_CreateMsg (1, "embarazada_se_despide", "<br/><br/>Vicky hace gestos de sentir náuseas y sin previo aviso entra en casa.<br/>"); 
GD_CreateMsg (1, "recuerdas_libro", "<br/>De repente... te acuerdas de tu viejo libro comprado en el mercado de Marrakech. Te viene a la memoria una página en concreto, con unas ilustraciones de una mujer embarazada de gemelos. ¿Por qué te habrá venido ese recuerdo ahora? Seguro que es una tontería, pero no te vas a quedar tranquilo hasta que consultes el libro.<br/>"); 
GD_CreateMsg (1, "libro_en_estudio", "«¡Mierda!», recuerdas que no metiste el libro en la maleta; «quizás el bueno de Freddie me lo pueda enviar por mensajería.»<br/>"); 
GD_CreateMsg (1, "pedir_cargador", "Pedir prestado un cargador<br/>"); 
GD_CreateMsg (1, "DLG_pedir_cargador_reacción", "Venga, va, pero no te lo olvides por ahí, que me da que eres un poco despistado.<br/>"); 
GD_CreateMsg (1, "DLG_pedir_cargador_reacción", "Bueno, tengo mucho, lío. Ya hablamos.")
GD_CreateMsg (1, "o1_te_devuelve_el_saludo", "%o1 te devuelve el saludo."); 
GD_CreateMsg (1, "DLG_se_despide", "Bueno, tengo mucho, lío. Ya hablamos.")
GD_CreateMsg (1, "se_va_o1", "%o1 se va<br/>"); 
GD_CreateMsg (1, "o1_te_mira", "%o1 te mira, esperando ver qué quieres.")
GD_CreateMsg (1, "la_marea_sube", "La marea sube y cada ves oyes el mar más cerca. Puede ser peligroso permanecer mucho tiempo aquí.<br/>");
GD_CreateMsg (1, "el_agua_entra", "El agua empieza a entrar en la cueva. Te asustas y te afanas por salir."); 
GD_CreateMsg (1, "el_agua_entra_y_mueres", "Sin embargo, resbalas y caes atrás. Tocas los barrotes pero no consigues asirlos por las algas pegadas. Un corrimiento de area aprisona tus pies y sólo puedes ser testigo de ver cómo cada vez entra más agua. Cuando por fin el agua te sobrepasa y no te deja respirar, crees ver la figura de tu querida hermana, que te sonríe y te ofrece la mano para que vayas con ella a un círculo de luz.<br/><br/><hr/>"); 
GD_CreateMsg (1, "fin_juego_asfixia_sin_cinturón", "El juego ha terminado, pero ¿qué habría pasado si hubieras atado una cuerda o similar a los barrotes para poder salir con ellos?")
GD_CreateMsg (1, "el_agua_entra_y_sales", "Afortunadamente, consigues asir los barrotes sin resbalarte, pero te apuntas mentalmente atar algo a los barrotes para no volver a llevarte este susto.<br/><br/>")
GD_CreateMsg (1, "el_agua_entra_y_sales_con_cinturón", "Agarras el cinturón y tirando de él consigues salir sin demasiados problemas<br/><br/>")
GD_CreateMsg (1, "cueva_se_oscurece", "Estar sin luz en la cueva es superior a ti. A duras penas recoges tus cosas y sales a trompicones.<br/><br/>"); 
GD_CreateMsg (1, "comes_con_ansia", "¡La hora que es y aún sin comer! Devoras con ansia el contenido de la cesta de TelePapeo.<br/><br/>"); 
GD_CreateMsg (1, "fantasma_te_incita_a_hechizo", "Oyes una voz que te dice \'haz el hechizo, hazlo, ¡hazlo!\'"); 
GD_CreateMsg (1, "fantasma_te_mira_enfadado", "Tu querida hermana brilla en la noche y te señala el camino.<br/><br/>"); 
GD_CreateMsg (1, "fantasma__te_empuja_a_o1", "Tu querida hermana no soporta la espera y te arrastra a %o1.<br/><br/>"); 
GD_CreateMsg (1, "fantasma_te_apunta_dos_direcciones", "Con cada mano apunta dos direcciones, como preguntándote dónde quieres morir y reunirte con ella: si en el promontorio o en la cueva de la caleta."); 
GD_CreateMsg (1, "te_asfixias_con_fantasma", "La marea sube irremediablemente. El agua te cubre y empiezas a experimentar la misma asfixia que tu querida hermana el día en que murió. Tu querida hermana te mira complacida, pronto te reunirás con ella."); 
GD_CreateMsg (1, "mueres_asfixiado_con_fanstama", "Tu querida hermana se acerca y te toma por la mano. La acompañas a un círculo luminoso, al mirar atrás ves tu cuerpo ahogado en la cueva.<hr/>"); 
GD_CreateMsg (1, "fin_juego_asfixia", "El juego ha terminado, pero quizás podría haber sido de otra manera si no te hubieras sentido tan apegado al collar de tu querida hermana.")
GD_CreateMsg (1, "marea_alta", "La marea cubre la entrada a la cueva donde toco ocurrió.<br/><br/>"); 
GD_CreateMsg (1, "marea_baja", "La marea está muy baja y permite ver la entrada a la cueva donde toco ocurrió.<br/><br/>"); 
GD_CreateMsg (1, "Freddie_solo_saludar", "Simplemente lo saludas y te aseguras de que va todo bien por el estudio."); 
GD_CreateMsg (1, "Freddie_cancelar_paquete", "Te lo piensas mejor, y al final no le pides nada y te despides depués de asegurarte de que va todo bien por el estudio."); 
GD_CreateMsg (1, "Freddie_fin_paquete", "Te despides, insistiéndole que te envíe el paquete urgente, que ya se lo pagarás."); 
GD_CreateMsg (1, "Freddie_cargador", "Le pides el cargador."); 
GD_CreateMsg (1, "Freddie_foto", "Le pides la foto tuya con tu querida hermana."); 
GD_CreateMsg (1, "Freddie_libro", "Le pides el libro ilustrado."); 
GD_CreateMsg (1, "Freddie_solo_saludar_reacción", "Freddie te dice que va todo bien y cuelga."); 
GD_CreateMsg (1, "Freddie_cancelar_paquete_reacción", "Freddie te dice que va todo bien y cuelga."); 
GD_CreateMsg (1, "Freddie_fin_paquete", "Freddie te dice te lo enviará ahora mismo."); 
GD_CreateMsg (1, "Freddie_pedido_reacción", "Freddie te dice que te lo enviará mañana por correo y que si quieres algo más."); 
GD_CreateMsg (1, "pedido_ya_realizado", "En realidad, con lo que ya pediste te puedes apañar por hoy, así que te resignas y cuelgas.<br/>"); 
GD_CreateMsg (1, "TelePapeo_cancelar_paquete", "Te lo piensas mejor, y al final no pides nada."); 
GD_CreateMsg (1, "TelePapeo_fin_paquete", "Cierras el pedido, que recibirás en la puerta de la casa."); 
GD_CreateMsg (1, "TelePapeo_prod_agua" , "Añadir agua al pedido"); 
GD_CreateMsg (1, "TelePapeo_prod_cocacola" , "Añadir cocacola al pedido"); 
GD_CreateMsg (1, "TelePapeo_prod_cerveza" , "Añadir cerveza al pedido"); 
GD_CreateMsg (1, "TelePapeo_prod_chocolate" , "Añadir chocolate al pedido"); 
GD_CreateMsg (1, "TelePapeo_prod_whisky" , "Añadir whisky al pedido"); 
GD_CreateMsg (1, "TelePapeo_prod_bocadillo" , "Añadir bocadillo al pedido"); 
GD_CreateMsg (1, "TelePapeo_prod_pizza" , "Añadir pizza al pedido"); 
GD_CreateMsg (1, "TelePapeo_prod_patatas fritas" , "Añadir patatas fritas al pedido"); 
GD_CreateMsg (1, "TelePapeo_cancelar_paquete_reacción", "Cancelas el pedido a TelePapeo.<br/>"); 
GD_CreateMsg (1, "TelePapeo_fin_paquete", "TelePapeo te dice te lo enviará ahora mismo.<br/>"); 
GD_CreateMsg (1, "TelePapeo_pedido_reacción", "Lo añades al pedido"); 
GD_CreateMsg (1, "whisky_antes_de_tiempo", "En realidad eres más de ron que de whisky, así que lo descartas."); 
GD_CreateMsg (1, "saludar_embarazada", "Hola, Vicky, ¿qué tal estás?"); 
GD_CreateMsg (1, "saludar_hippie", "Hola compadre, ¿cómo va todo?"); 
// GD_CreateMsg (1, "Vicky_hablar_de_tu_libro", "Vicky_hablar_de_tu_libro"); 
// GD_CreateMsg (1, "Vicky_hablar_de_tu_hermana", "Vicky_hablar_de_tu_hermana"); 
// GD_CreateMsg (1, "Vicky_hablar_de_tu_madre", "Vicky_hablar_de_tu_madre"); 
// GD_CreateMsg (1, "Vicky_hablar_de_la_casa", "Vicky_hablar_de_la_casa"); 
// GD_CreateMsg (1, "Vicky_hablar_de_infancia", "Vicky_hablar_de_infancia"); 
GD_CreateMsg (1, "Vicky_preguntar_por_embarazo", "Preguntar a Vicky por embarazo"); 
GD_CreateMsg (1, "Vicky_invitar_a_comer", "Te invito a comer algo"); 
GD_CreateMsg (1, "embarazada_dice_estoy_aquí", "¿No ves que estoy aquí, para qué me llamas?"); 
GD_CreateMsg (1, "embarazada_dice_no_puedo_hablar_ahora", "Ahora no te puedo atender, lo siento. Estaré libre de 10:00 a 17:00. Llamame entonces. Besos."); 
GD_CreateMsg (1, "y_cuelga", " Y cuelga<br/>"); 
GD_CreateMsg (1, "embarazada_dice_qué_quieres", "Hola, querido Al, ¿qué puedo hacer por ti?"); 
GD_CreateMsg (1, "Y_cuelga", "Y cuelga el teléfono.<br/>"); 
GD_CreateMsg (1, "saludar_embarazada_reacción", "Le preguntas qué tal está, a ver si te cuenta algo.<br/>"); 
GD_CreateMsg (1, "DLG_Vicky_responde_saludo", "Todo bien, majete. A ver si nos vemos.");
GD_CreateMsg (1, "DLG_Vicky_no_mas_chocolate", "Al, júrame que no me dejarás volver a comer chocolate. Sentí como un demonio en el estómago.");
GD_CreateMsg (1, "Vicky_preguntar_por_embarazo_reacción", "Con mucho tacto masculino, le preguntas a Vicky si está embarazada de gemelos."); 
GD_CreateMsg (1, "DLG_confirma_embarazo_gemelos", "¿Tan gorda estoy? Sí, de gemelos. Te iba a decir que tengo un antojito de chocolate y tenías algo, pero como veo que me ves como una foca, casi que me abstengo.");
GD_CreateMsg (1, "invitas_sin_chocolate", "Vicky se planta contigo en casa y da buena cuenta de la comida, pero en cuanto ve que no tienes chocolate, se va apresuradamente no sin antes soltarte que \'a ver si la próxima vez me invitas a chocolate, vecino.\'.<br/><br/>"); 
GD_CreateMsg (1, "escena_merienda_con_Vicky_1", "A los pocos minutos, tienes a Vicky en casa. Durante unas horas os ponéis al día sobre vuestras vidas. Te habla sobre la aburrida vida de la villa costera y cómo te ha echado de menos."); 
GD_CreateMsg (1, "DLG_embarazada_habla_1", "Querido Al, ¡qué raro se me hace verte sin tu querida hermana al lado! Después de aquello, tu madre te envió lejos y casi no tuvimos tiempo ni de despedirnos. Pensarás que estoy loca, pero cuando he ido a dejar flores a las tumbas de tu hermana y tu malograda madre, las brumas de la costa siempre parecen tomar sus formas, como llamándome a reunirme con ellas. Una vez casi me despeño en el promontorio.");
GD_CreateMsg (1, "escena_merienda_con_Vicky_2", "<br/>Vicky da buena cuenta del helado de chocolate. Comienza comiendo comedidamente, pero luego devora como una posesa... tan posesa que con la boca llena de chocolate te mira con los ojos en blanco y te dice:<br/>"); 
GD_CreateMsg (1, "DLG_embarazada_habla_2", "Querido hermano, pronto estaremos juntos. Necesitarás sangre de nuestra nueva madre para realizar el hechizo de reunión. Aquí te dejo un poco");
GD_CreateMsg (1, "escena_merienda_con_Vicky_3", "<br/><br/>Observas atónito cómo Vicky se muerde ligeramente el labio y recoge unas gotas de sangre con una servilleta, que te tira por encima de la mesa.	Acto seguido, como si hubiera sido un mal sueño, Vicky toma el control de su cuerpo y sigue hablando como si nada:<br/>"); 
GD_CreateMsg (1, "DLG_embarazada_habla_3", "¡Qué tonta, me he mordido de tantas ganas que tenía de chocolate!");
GD_CreateMsg (1, "escena_merienda_con_Vicky_4", "<br/><br/>Poco después, Vicky regresa a su casa y tú sigues con tus rutinas.<br/><br/>"); 
GD_CreateMsg (1, "Vicky_no_tiene_qué_decir", "Vicky no tiene mucho que decirte."); 
GD_CreateMsg (1, "hippie_dice_estoy_aquí", "¿No ves que estoy aquí, para qué me llamas?"); 
GD_CreateMsg (1, "hippie_dice_no_puedo_hablar_ahora", "Po favó, déjame \'rmir un poito más."); 
GD_CreateMsg (1, "y_cuelga", " Y cuelga<br/>"); 
GD_CreateMsg (1, "hippie_saturado_de_fiestas", "Hermano, yo no tengo tu aguante. Creo que dejaré las fiestas por un tiempo y me dedicaré a surferar. No me llames por un tiempo, que me tengo que recuperar."); 
GD_CreateMsg (1, "Charlie_te_invita_a_fiesta", "Entre un montón de ruido de fondo de música y risas, sólo le alcanzas a entender que necesita más whisky, que te vengas al fiestón y que te quiere mucho.<br/>"); 
