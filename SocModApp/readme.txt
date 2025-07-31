Nastroj na simulaci vyvoje spolecnosti ve stragicke stolni hre.
Cilem neni realisticka simulace ale zajimave chovani pro ucely hry.

Zakladni urovni modelace spolecnosti je popis hodntoveho systemu spolecnosti pomoci primarnich atributu (na stupnici od -3 do +3)
Sekundarni atribut jistota (Confidence) (na stupnici od -3 do +3) urcuje duveru populace v system.
Pri dosazeni -3 dochazi k revoluci a GM rucne upravi stav. Pro nase ucely tim tedy simulace konci (mozna ze bude nahrazeno nejakym pravidlem)


Kazde kolo je vyhodnoceno pro kazdy primarni atribut, zda nedojde k jeho zmene, 
tato zmena zaroven vede ke zmene jistoty.

Vyhodnoceni zmeny atributu.
Budou definovany pojmenovane udalosti, kazda zmena ma definovanou zmenu jistoty a velikost zmeny primarniho atributu

neco jako:
1) navrat zpet
2) vsechno pri starem
3) mala zmena
4) velka zmena
5) revolucni zmena

pravdepodobnost jednotlivych udalosti je definovana pro kazdou udalost a jistotu.
Pro tyto ucely vyberu pravdepodobnosti se jistota zaokrouhluje k nejblizsimu celemu cislu,
tedy -.5 az +.4999... je rizeno pravdepodobnosti pro jistotu 0.
Smer zmeny atributu je urcen na zaklade soucasne hodnoty atributu.
Pro kazdou (zaokrouhlenou na cele cislo) hodnotu atributu bude urcena pravdepodobnost, 
ze zmena bude s opacnym znamenkem nez je hodnota atributu (mozna v budoucny nahradime hladkou funkci)

udalost navrat zpet je zvlastni, bude nalezena posledni zmena tohoto atributu a atribut bude zmen opacnym zpusobem.

V budoucnu budou pridvany dalsi pravidla, ale toto je zaklad simulace.

nazvy primarnich atributu budou definovany v konfiguraci.
vse co lze popsat ve forme tabulky bude pokud mozno uvedeno v konfiguraci, nikoli napevno ve zdrojovem kodu.
nazvy by nemely byt pouzity k rizeni logiky, pro zvlastni pripady budou pouzity priznaky.

hodnoty atributu budou cisla s plovouci desetinou carkou, celociselne hodnoty se vyskytuji jen v definici pravidel

Tento popis je v cesky, ale zdrojovy kod vcetne nazvu funkci a promenych ma byt anglicky.

##########################################
Zprovozneni projektu.
#nejprve nainstalovat nvm a pomoci toho aktualni node (detaily vygooglit/zeptat se gpt)

#pouzivam powershell, ten defaultne nechce spoustet skripty, tak povolime
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

#ruzne prikazy ktere jsem spoustel, nevim co je zapotrebi a co uz ne !!!!

#priprava
npm init -y
npm install --save-dev typescript
npx tsc --init
#instalce nastroje vite
npm install vite --save-dev
#instalace podpory unit testu
npm install -D vitest
npm install -D @vitest/ui
npm install --save-dev @types/node

#stazeni knihoven podle package.json
npm install

#lokalni spusteni v dev rezimu (bez buildu)
npm run dev

#build a lokalni spusteni zbuildeneho
npm run build
npm run preview

#spusteni testu z prikazove radky
npm run test
#spusteni testu s prohlizecovym ui
npm run test:ui

spusteni simulace z node
node .\node\simulate.js

#bezpecnostni aktualizace balicku
npm audit fix 
#bezpecnostni aktualizace balicku - vcetne breaking change
npm audit fix --force

#podpora pro nasazeni prez github pages
npm install --save-dev gh-pages