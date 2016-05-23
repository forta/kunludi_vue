//Section 1a: gameReaction (lib overwrite)
//Section 1b: gameReaction (game actions)
//Section 2: gameAttribute 
//Section 3: gameItems

// **********************************************
//Section 1: gameReaction
// **********************************************


exports.reactionList = [];

let libModule = {}, libReactions = {}

exports.dependsOn = function (libModule, libReactions) {
	this.libModule = libModule
	this.libReactions = libReactions
}

let ludi_game = {}

// ============================

ludi_game.reactions = []; // set of default-reaction functions

/*

	lib actions: preni, malfermi

	overwritten lib actions: rigardi (just for testing)
	
*/

// overwritten actions

// komuna kodo por mangxi kaj trinki
ludi_game.reactionManghi_Trinki = function (actionId, libIndex, par_c, fromDown) { // interna
	var attId;
	
	if (actionId == "drink") attId = "isDrinkAble";
	else if (actionId == "eat") attId = "isEatAble";
	else return false;

	fromDown = (fromDown === true);
	// save current loc
	var oldLoc = IT_GetLoc (par_c.item1);
	
	// energy to PC
	var energy = IT_GetAttPropValue (par_c.item1, attId, "energy");
	
	// default lib reaction: item is destroyed
	
	ludi_lib.reactions[libIndex].reaction(par_c, fromDown);
	

	// poison?
	if (IT_AttPropExists(par_c.item1, attId, "poison")) {
		var poison = IT_GetAttPropValue (par_c.item1, attId, "poison");
		// LUDIa aldonajxo:
		CA_ShowMsg ("Venena");
		CA_ShowMsg ("Vi perdas energion");
		IT_IncrAttPropValue (PC_X(), "hasEnergy", "energy", -energy);
	} else {
		CA_ShowMsg ("Vi gajnis energion");
		IT_IncrAttPropValue (PC_X(), "hasEnergy", "energy", +energy);
	}
	
	// then, the new object (if ite exists) is moved to the old loc
	if (IT_AttPropExists(par_c.item1, attId, "newObj")) {
		var newObjectId = IT_GetAttPropValue (par_c.item1, attId, "newObj");
		if (typeof newObjectId != 'undefined')
			IT_SetLoc (IT_X(newObjectId), oldLoc);
	}
	return true;
}

ludi_game.reactions.push ({
	id: 'drink',
	reaction: function (par_c, fromDown) {
		return ludi_game.reactionManghi_Trinki (this.id, this.libIndex, par_c, fromDown);
	}
});

ludi_game.reactions.push ({
	id: 'eat',
	reaction: function (par_c, fromDown) {
		return ludi_game.reactionManghi_Trinki (this.id, this.libIndex, par_c, fromDown);
	}
});

ludi_game.reactions.push ({
	id: 'climb', // grimpi
	
	enabled: function (indexItem,indexItem2) {
		return true;
	},
	
	reaction: function (par_c) {
	
		if ( (PC_GetCurrentLoc() == IT_X("loc_al_la_shipo")) &&
		     (IT_CarriedOrHere (IT_X("obj_pendanta_ŝnuro"))) ) {
			// fakte, nue se sxnuro jam jetita
			CA_ShowMsg ("Vi grimpas en la pendanta ŝnuro,$D kelkfoje ĝi preskaŭ rompiĝas, $D sed vi sukcesas grimpi ĝis la rando.$D");
			PC_SetCurrentLoc (IT_X("loc_sur_la_shipo"));
			return true;
		}
		return false;
		CA_ShowMsg ("Vi ne scias kiel grimpi");

	},
	
});


ludi_game.reactions.push ({
	id: 'dig_with',
	enabled: function (indexItem,indexItem2) {
		 return PC_CheckCurrentLocId ("loc_okcidenta_strando");
	}
});


ludi_game.reactions.push ({
	id: 'swim',
	enabled: function (indexItem,indexItem2) {
		 return (PC_CheckCurrentLocId("loc_al_la_shipo"));
	},
	reaction: function (par_c) {
		if (PC_CheckCurrentLocId("loc_al_la_shipo")) {
			CA_ShowMsg("Vi naĝas en la maro");
			PC_GO_TO ("loc_sur_la_shipo");
			return true;
		}
		return false;
	}
});

ludi_game.reactions.push ({
	id: 'investigate',
	enabled: function (indexItem,indexItem2) {
		  return (PC_CheckCurrentLocId("loc_baborda_mezshipo") ||
				  PC_CheckCurrentLocId("loc_antaŭa_kajuto"));
	},
	reaction: function (par_c) {
		if (PC_CheckCurrentLocId("loc_baborda_mezshipo")) {
			CA_ShowMsg("Vi ne retrovas la ŝnuron aŭ la hokon.");
			return true;
		} else if (PC_CheckCurrentLocId("loc_antaŭa_kajuto")) {
			CA_ShowMsg("Se vi bone serĉas en la fojno vi rimarkas ke la dorminto gardis ĉi tie oran moneron.");
			IT_BringHere (IT_X("obj_ora_monero"));
			return true;
		}
	}

});

ludi_game.reactions.push ({
	id: 'jump',
	reaction: function (par_c) {

		if (PC_CheckCurrentLocId("loc_baborda_mezshipo")){
			CA_ShowMsg("Vi saltas malsupren de la ŝipo.");
			PC_SetCurrentLoc (IT_X("loc_salti_de_la_shipo"));
			return true;
		}
		return false;
	}
});

ludi_game.reactions.push ({
	id: 'untie',
	enabled: function (indexItem,indexItem2) {
		  return (PC_CheckCurrentLocId("loc_subŝipo"));
	},
	reaction: function (par_c) {
		if (PC_CheckCurrentLocId("loc_subŝipo")) { // ??? for any object???
			CA_ShowMsg("Bone, vi estas heroo!$D La knabo diras al vi ke ili simple ludis sur la strando kaj tiam trovis la keston.$D Ĉe la piratŝipo iu aĉa severa pirato kunportis ilin ĉi tien.");
			PC_SetCurrentLoc (IT_X("loc_fino"));
			return true;
		}
		return false;
	}
});



ludi_game.reactions.push ({
	id: 'smell',
	enabled: function (indexItem,indexItem2) {
		 return (indexItem == IT_X("obj_dormanta_matroso"));
	}
});


// complex RPG combat
ludi_game.combat = function (source, target, weapon) {
	
	if (source == PC_X()) {
		CA_ShowMsg("Vi atakas %o1", [target]);
	} else {
		CA_ShowMsg("%o1 atakas vin!", [source]);
	}
	
	// simple combat: atako - protekto
	var atako = MISC_Random (+IT_GetAttPropValue (source, "hasEnergy", "atako"));
	var protekto = MISC_Random(+IT_GetAttPropValue (target, "hasEnergy", "protekto"));
	var vundo = atako - protekto;
	
	if (vundo>0) {
		IT_IncrAttPropValue (target, "hasEnergy", "energy", -vundo);
		if (source == PC_X()) {
			CA_ShowMsg("Vi vundas %o1.", [target]);
		} else {
			CA_ShowMsg("%o1 vundas vin!", [source]);
		}
	} else {
		if (source == PC_X()) {
			CA_ShowMsg("Vi ne vundas %o1.", [target]);		
		} else {
			CA_ShowMsg("%o1 ne vundas vin!", [source]);
		}
	}
	
	if (+IT_GetAttPropValue (target, "hasEnergy", "energy") <0) {
		if (source == PC_X()) {
			CA_ShowMsg("Vi mortigas %o1.", [target]);
		} else {
			CA_ShowMsg("%o1 mortigas vin!", [source]);
			CA_EndGame ();
			return;
		}
		var newObjectId = IT_GetAttPropValue (target, "hasEnergy", "newObj");
		IT_ReplacedBy (target, IT_X(newObjectId));
	}
	
}

ludi_game.reactions.push ({
	id: 'attack',
	enabled: function (indexItem,indexItem2) {
		if (IT_ATT(indexItem, "hasEnergy")) return true;
	},
	reaction: function (par_c) { // complex RPG combat
		return ludi_game.combat(par_c.pc, par_c.item1, -1);
	}
});

ludi_game.reactions.push ({
	id: 'take',
	enabled: function (indexItem,indexItem2) {
		if ((indexItem == IT_X("obj_malnova_sako")) ||  (indexItem == IT_X("obj_pendanta_ŝnuro_2")))
			return true;
	}
});

ludi_game.reactions.push ({
	id: 'open',
	enabled: function (indexItem,indexItem2) {
		 return ((indexItem == IT_X("obj_ligna_kesto")) || 
				 (indexItem == IT_X("obj_ligna_kesto_3"))) ;
	}
});

ludi_game.reactions.push ({
	id: 'burn',
	enabled: function (indexItem,indexItem2) {
		 return ((indexItem == IT_X("obj_sisala_ŝnuro")) || 
				 (indexItem == IT_X("obj_pendanta_ŝnuro")) || 
				 (indexItem == IT_X("obj_pendanta_ŝnuro_2")) || 
				 (indexItem == IT_X("obj_malseka_fojno")));
	}
});

ludi_game.reactions.push ({ // 2 par ??? !!!
	id: 'throwAction',
	enabled: function (indexItem,indexItem2) {
		 return ((indexItem == IT_X("obj_sisala_ŝnuro")) && 
				 (indexItem2 == IT_X("obj_pirata_ŝipo")));
	}
});

ludi_game.reactions.push ({
	id: 'pull',
	enabled: function (indexItem,indexItem2) {
		 return (indexItem == IT_X("obj_pendanta_ŝnuro"));
	}
});

ludi_game.reactions.push ({
	id: 'raise',
	enabled: function (indexItem,indexItem2) {
		return (indexItem == IT_X("obj_fera_ankraĉeno"));
	}
});

ludi_game.reactions.push ({
	id: 'strike',
	enabled: function (indexItem,indexItem2) {
		 return (indexItem == IT_X ("npc_forta_pirato"));
	}
});


// specific game actions



// **********************************************
//Section 2: gameAttribute 
// **********************************************

ludi_game.attribute = []; 


// **********************************************
//Section 3: items
/*
available methods for each item:
	desc()
	[precondToGo(dir)] // for "loc" items: to unlock/unlock exits
	turn() // by now, mandatory for "npc" and "pc" items
	
	
*/
	
// **********************************************

ludi_game.items = []; 

ludi_game.items.push ({
	id: 'obj_ligna_kesto',
	open: function() {
		CA_ShowMsg("La ĉarniro knaras$D kiam vi malfermas la malnovan keston.$D.");
		PC_SetCurrentLoc (IT_X("loc_en_la_kavo_2")); // salto al mapa alternativo
		return true; // done
	}
});

ludi_game.items.push ({
	id: 'obj_ligna_kesto_3',
	open: function() {
		CA_ShowMsg("Ĝi estas ŝlosita per seruro!"); // nosotros, lo haremos usando un atributo?
		return true; // done
	}
});

ludi_game.items.push ({
	id: 'loc_dunvojo',
	
	look_dir_disabled: function (dirIndex) { 
		if (dirIndex <0) return ;
		
		if (dirIndex == DIR_GetIndex("d180")) {
			CA_ShowMsg ("EL_duonvojo_AL_urbo");
		}

	},

	firstDesc: function (indexItem2) {
		CA_ShowMsg ("Introduction");
		CA_ShowMsgAsIs ("<p></p>");
	}
	
});


ludi_game.items.push ({
	id: 'obj_plastika_ŝovelilo',
	dig_with: function() {
		if (PC_CheckCurrentLocId ("loc_okcidenta_strando")) {
			showText ("Per tiu infana ŝovelilo vi nur kapablas fosi malgrandan truon. Ĉar vi uzas tro multe da forto, vi rompas la ŝovelilon.");
			IT_SetLoc ("obj_plastika_ŝovelilo", "loc_limbo");
			return true; // done
		}
		return false; // nothing done in item scope
	}
});

ludi_game.items.push ({
	id: 'obj_irlanda_viskio',
	drink: function() {
		if  (loc("loc_mortas")) {
			CA_ShowMsg("Vi trinkas la viskion.$D Vi ebriiĝas kaj endormiĝas mallongan tempon,$D kiam vi denove vekiĝas la kapitano ĉeestas.");
			IT_ReplacedBy (this.index, IT_X("obj_malplena viskibotelo"));
			IT_BringHere (IT_X("npc_pirata_kapitano"));
			Loko("loc.kajuto"); //???
			return true; // done
		}
	}
});

ludi_game.items.push ({
	id: 'obj_plena_bierbotelo',
	drink: function() {
		/*
		if (MonstroParametro("io")) { // en realidad es evento de monstro y el this.index apuntará al monstruo
			CA_ShowMsg("La $M trinkas la bieron kaj forjhetas la botelon."); // $M: la mostro
			IT_BringHere (IT_X("obj_malplena_bierbotelo"));
			return true; // done
		} 
		*/
		CA_ShowMsg("La biero (grolŝo) ege bongustas, ĉar la botelo estis sufiĉe malvarma. Vi do tute ne plu soifas.");
		IT_ReplacedBy (this.index, IT_X("obj_malplena_bierbotelo"));
		PC_Points (5);
		return true;
	}
});

ludi_game.items.push ({
	id: 'obj_kokakolaa_boteleto',
	drink: function() {
		/*
		if (MonstroParametro("io")) { // evento???
			CA_ShowMsg("La $M ne volas trinki la kokakolaon ĉar tiu trinkaĵo malbone gustas."); // $M: la mostro
			return true; // done
		} 
		*/
		CA_ShowMsg("Se vi trinkas la kokakolaon, la gusto ne plaĉas al vi. Sed vi soifas do eltrinkas la tutan boteleton.");
		//// IT_ReplacedBy (this.index, IT_X("obj_malplena_boteleto"));
		return false; // general game reaction continues
	}
});


ludi_game.items.push ({
	id: 'obj_dormanta_matroso',
	listen: function() {
		CA_ShowMsg("Vi aŭdas ronkantan matroson.");
		return true; // done
	},
	smell: function() {
		CA_ShowMsg("Vi flaras la acidan odoron de la matrosa vomado.")
		return true; // done
	},
	wakeup: function() {
		CA_ShowMsg("Estas malfacile veki ebrian matroson.$D Sed tamen post iom da tempo vi sukcesas.$D Sed la matroso furiozas kaj batas vin.$D aŭ!$D");
		PC_SetCurrentLoc (IT_X("loc_mortas"));
		return true; // done
	},
	attack: function() {
		CA_ShowMsg("Nun la matroso mortas.");
		IT_ReplacedBy (this.index, IT_X("obj_morta_matroso"));
		return true; // done
	}
});


ludi_game.items.push ({
	id: 'obj_malnova_sako',
	take: function() {
		IT_SetLoc (this.index, PC_X());
		CA_ShowMsg("Vi vidas ke sub la sako troviĝas iu metala aĵo.");
		IT_ReplacedBy (this.index, IT_X("obj_malnova_sako_2"));
		var indexMetalaAjho = IT_X("obj_metala_aĵo");
		IT_SetLoc (indexMetalaAjho, PC_GetCurrentLoc());
		IT_SetAttPropValue (indexMetalaAjho, "hasDecrementor", "active", "true"); // bomb counter starts
		return true;
	}
});

ludi_game.items.push ({
	id: 'obj_metala_aĵo', 
	
	turn: function() {
		if (IT_GetId(IT_GetLoc(this.index)) == "limbo") return;
		if (IT_GetAttPropValue (this.index, "hasDecrementor", "active") == "false") return;

		// kiam dekrementilo nulas (startas je 5), eksplodo
		if (IT_GetAttPropValue (this.index, "hasDecrementor", "counter") == "0") {
			// eksplodo
			IT_SetAttPropValue (this.index, "hasDecrementor", "active", "false");
			
			// monstroj_fugxas_el_cxi_tie();
			if (IT_CarriedOrHere(this.index)) {
				CA_ShowMsg("La bombo eksplodas.");
				PC_SetCurrentLoc (IT_X("loc_post_eksplodo"));
				CA_ShowDesc (PC_GetCurrentLoc());
				CA_EndGame ();
			} else {
				CA_ShowMsg("Vi aŭdas grandan eksplodon.");
			}
			
			IT_SetLocToLimbo (this.index);
		} else {
			IT_IncrAttPropValue (this.index, "hasDecrementor", "counter", -1); 
		}
	}
});


ludi_game.items.push ({
	id: 'obj_sisala_ŝnuro',
	burn: function() {
		CA_ShowMsg("La ŝnuro elbrulis,$D la hoko restas.");
		IT_ReplacedBy (this.index, IT_X("obj_metala_hoko"));
		return true;
	},
	throwAction: function(par_c) { 
		if ( (par_c.item2 != IT_X('obj_pirata_ŝipo')) && (par_c.item2 != IT_X('obj_pirata_ŝipo')) ){
			CA_ShowMsg("Kien?"); // LUDI-a aldonajxo
			return true; 
		}
		CA_ShowMsg("Vi jhetas la ŝnuron al la ŝipo,$D kaj la hoko hokas malantaŭ la ŝiprando, la ŝnuro pendas al la hoko.");
		IT_ReplacedBy (IT_X("obj_sisala_ŝnuro"), IT_X("obj_pendanta_ŝnuro"));
		IT_ReplacedBy (this.index, IT_X("obj_pirata_ŝipo_2"));
		PC_Points(1);
		return true;
	}	
});

ludi_game.items.push ({
	id: 'obj_pendanta_ŝnuro',
	burn: function() {
		if (IT_Here(IT_X("obj_pirata_ŝipo_2"))) {
			CA_ShowMsg("La ŝnuro forbrulis.");
			IT_SetLocToLimbo(this.index);
			IT_ReplacedBy (IT_X("obj_pirata_ŝipo_2"), IT_X("obj_pirata_ŝipo"));
			return true; // done
		}
		return false; // nothing done in item scope
	}, 
	pull: function () {
		if (IT_Here(IT_X("obj_pirata_ŝipo"))) {
			CA_ShowMsg("Kiam vi tiras al la ŝnuro, vi tiras iomete tro forte por la foruzita ŝnuro,$D ĝi rompiĝas.");
			IT_ReplacedBy (IT_X("obj_pendanta_ŝnuro"), IT_X("obj_rompita_ŝnuro")); 
			IT_ReplacedBy(IT_X("obj_pirata_ŝipo_2"), IT_X("obj_pirata_ŝipo"));
			return true; // done
		}
		return false; // nothing done in item scope
	}
});

ludi_game.items.push ({
	id: 'obj_pendanta_ŝnuro_2',
	take: function() {
		// loc_sur_la_shipo ?
		CA_ShowMsg("Vi klopodas perforte forigi la hokon de la rando, unue ŝajnas ke vi estas senŝanca.$D Sed vi daŭrigas vian laboron kaj finfine sukcesas, nur tio okazis tiel neantaŭvidita ke la ŝnuro kun hoko subite falas el viaj manoj.");
		PC_SetCurrentLoc (IT_X("loc_baborda_mezshipo"));
		return true;
	}
});

ludi_game.items.push ({
	id: 'obj_pendanta_ŝnuro_2',
	burn: function() {
		CA_ShowMsg("La ŝnuro forbrulis kaj falas teren.");
		PC_SetCurrentLoc (IT_X("loc_baborda_mezshipo"));
		return true; // done
	}
});

ludi_game.items.push ({
	id: 'obj_malseka_fojno',
	burn: function() {
		CA_ShowMsg("La fojno facile ekbrulas,$D eĉ tiel facile ke ne nur la fojno fajras, sed la tuta ŝipo.");
		PC_SetCurrentLoc (IT_X("loc_ŝipo_en_fajro"));
		return true; // done
	}
});

ludi_game.items.push ({
	id: 'npc_bruna_rato',
	throwAction: function() {
		CA_ShowMsg("  Vi –etas la $Pn al la $M.$D Vi preskaŭ trafis ĝin,$D malfeliĉe por vi, ĝi nun eĉ pli agresivas.$D Do post mallonga tempo la $M ekkuras al vi.$D Vi pensas rapide kaj konkludas ke vi tute ne havas ŝancon do vi forkuras en paniko.$D");
		PC_SetCurrentLoc (IT_X("loc_perdita_en_dunoj"));
		return true; // done
	}
});

ludi_game.items.push ({
	id: 'obj_fera_ankraĉeno',
	raise: function() {
		CA_ShowMsg("Kiam vi levas la ankron la veloj elvolviĝas,$D la vento blovas en ilin kaj la ŝipo ekmoviĝas.$D Vi velas al iu alia insulo kaj vi elŝipiĝas.$D");
		PC_Points(3);
		PC_SetCurrentLoc (IT_X("loc_nova_insulo"));
		return true; // done
	}
});

ludi_game.items.push ({
	id: 'npc_forta_pirato',
	strike: function() {
		if (par_c.item2 == IT_X('obj_ligna_bastono')) {
			CA_ShowMsg("Vi batas per la $P$D. Estas trafo!$D Vi trafis la piraton ghuste al la tempio.$D Li falas teren kaj mortiĝas.");
			IT_SetLocToLimbo(this.index);
			IT_ReplacedBy (this.index, IT_X("obj_morta_pirato"));
			return true; // done
		}
		return false; // nothing done in item scope
	}
});

// NPC turns
/*
MANGHEMO    PozNum;    { Se manghas ion:  Agreso:= Agreso - Maghemo }
 | TRINKEMO    PozNum;    { Se trinkas ion: Agreso:= Agreso - Trinkemo }
 | ATAKO       PozNum;    { SHanco ke trafas karakteron se atakas,
                            Kutime inter 0 kaj 100 }
 | AGRESO      Num;       { Indikas Atakemo, chi numero shanghighas dum la ludo
                            kutime grandighas, se je iu momento > 0 la
                            monstro povas ataki }
 | PROTEKTO    PozNum;    { Indikas malfacileco trafi la monstron }
 | VIVOJ       PozNum;    { Se iam <= 0: mortas }
 | FUGHEMO     PozNum;    { Sen indiko: 0, neniam fughas, alie: shanco }
 | VAGEMO      PozNum;    { Sen indiko: 0, neniam vagas, alie: shanco }
 
   | PERPAFI       PozNum;      { Se trafas:
                                 Vivoj:= Vivoj - HazardNumero(PerPafi) }
  | SHARGO        PozNum;      { Kiom ofte pafi per ghi }
  | PERBATI       PozNum;      { Se trafas:
                                 Vivoj:= Vivoj - HazardNumero(PerBati) }
  | PERPIKI       PozNum;      { Se trafas:
                                 Vivoj:= Vivoj - HazardNumero(PerPiki) }
  | MANGHEBLO     PozNum;      { Se manghata aw trinkata, shangho de
                                 satignombron. }
  | TRINKEBLO     PozNum;      { Se manghata aw trinkata, shngho de
                                 malsoifignombron. }
  | FAJRODAWRO    PozNum;      { Se brulas, kiam longe ghis elbrulas }
  | FINO          PozNum;      { Se en iu loko, chiu vico minus unu,
                                 kiam ighas nul, tiam Fenomenas Fini }
								 
 */

ludi_game.monstruaVico = function (itemIndex) {

	var agreso = IT_GetAttPropValue (itemIndex, "hasEnergy", "agreso");
		var atako = IT_GetAttPropValue (itemIndex, "hasEnergy", "atako");
		var protekto = IT_GetAttPropValue (itemIndex, "hasEnergy", "protekto");

	var manghemo = IT_GetAttPropValue (itemIndex, "hasEnergy", "manghemo");
	var trinkemo = IT_GetAttPropValue (itemIndex, "hasEnergy", "trinkemo");
	var vagemo = IT_GetAttPropValue (itemIndex, "hasEnergy", "vagemo");

	// here!!
	agreso = 0; vagemo=1;
	
	if (agreso > 0) {
		// se uloj cxi tie
		if (PC_GetCurrentLoc() == IT_GetLoc (itemIndex)) {
			ludi_game.combat (itemIndex, PC_X(), -1);
			return true;
		}
	}
	
	if (manghemo > 0) {
		// se mangxajxo cxi tie
		//if () {
			
		//	return true;
		// }
	}
	
	if (trinkemo > 0) {
		// se drinkajxo cxi tie
		//if () {
			
		//	return true;
		// }
	} 
	
	if (vagemo > 0) {
		var randomLoc = IT_GetRandomDirectionFromLoc (IT_GetLoc(itemIndex));
		if (randomLoc != null) {
			var previousLoc = IT_GetLoc (itemIndex);

			if (PC_GetCurrentLoc() == previousLoc) {
				// show moving out
				CA_ShowMsg("%o1 moves to %o2 ", [itemIndex, randomLoc.target]); // to-do: ("%o1, moves to d1", itemIndex, randomLoc.dir);
			}
			
			IT_SetLoc (itemIndex, randomLoc.target);
			
			// console.log ("NPC " + ludi_runner.world.items[itemIndex].id + " nun je " + ludi_runner.world.items[randomLoc.target].id);
			
			if (PC_GetCurrentLoc() == randomLoc.target) {
				CA_ShowMsg("%o1 comes here from %o2 ", [itemIndex, randomLoc.target]); // to-do: ("%o1, moves to d1", itemIndex, randomLoc.dir);
				// show moving in
			}
				
			return true;
		}
	} 
	

}

/*
ludi_game.items.push ({
	id: 'npc_indiĝena_knabo',

	turn:function() {
		
		ludi_game.monstruaVico (this.index);
	}

});
*/
 
ludi_game.items.push ({
	id: 'npc_ebria_matroso',

	turn:function() {
		
		var obj2 = -1; // to-do:  kion manghi
		if (obj2 == IT_X("obj_irlanda_viskio")) {
			CA_ShowMsg("La matroso trinkas la viskion,$D post kelkaj  momentoj li endormiĝas.");
			IT_BringHere (IT_X("obj_malplena_viskibotelo"));
			IT_ReplacedBy (this.index, IT_X("obj_dormanta_matroso"));
			return true;
		} 
	}

});


// external functions: called by LUDI environment

// by default: []
ludi_game.statusArray = function () {
	
	var energy = IT_GetAttPropValue (PC_X(), "hasEnergy", "energy");
	return [
		{id:"energio",value:energy }
	];
}

// GENERIC turn **********************************************************************************************

ludi_game.turn = function (indexItem) {

	if (indexItem == PC_X()) {
		// PC losses energy each time
		IT_IncrAttPropValue (PC_X(), "hasEnergy", "energy", -1);
		if (IT_GetAttPropValue (PC_X(), "hasEnergy", "energy") <0 ) {
			CA_ShowMsg("Vi mortas pro laceco"); // LUDIa aldonajxo
			CA_EndGame ();
		}
		return true;
	}

	if (IT_ATT(indexItem, "hasEnergy")) {
		ludi_game.monstruaVico (indexItem);
	}

}
