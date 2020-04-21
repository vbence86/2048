---
name: Regression Test
about: Use this to administer a full regression test
title: "[RT] Full Regression Test"
labels: ''
assignees: ''

---

## Regerssion Test Sheet
This full regression test serves to improve efficiency and software quality of Five Nations.

### Tests
#### Full Screen
- [ ] When executing the application a prompt appears that asks whether the user wants to activate Full Screen mode or not
- [ ] When the users selects YES the application switches to Full Screen mode
- [ ] When the users selects NO the application remains in windowed-mode.
- [ ] When the fullscreen mode is activated the user can deactivate it by pressing ESC 

#### HUD
**Control Panel**
- [ ] Control Panel appears when at least one unit is selected
- [ ] Control Panel shows Entity Details section

**Control Buttons**
- [ ] Controll Panel shows controll buttons that belong to that particular unit. Check every unit type  (Fighter, Cruiser, Carrier, Battleship, worker, Expansionist)
- [ ] Selecting one unit from the HUD when multiple units are selceted selects that unit.

**Entity Details Section**
- [ ] Entity Icon is displayed

**Hotkeys**
- [ ] All unit controll button have its own hotkeys.
- [ ] When a hotkey is pressed which is not available to a unit (for example docking (Hotkey: D) for St. George) nothing happen
- [ ] Player can start upgrade by pressing the upgrade’s hotkey.
- [ ] With worker, every building have its own hotkey.
- [ ] Unit constructions are working with hotkeys.
- [ ] Upgrades in buildings are working hotkeys.

#### MENU
**Main Menu**
- [ ] Pause game pauses the game in multiplayer.
- [ ] Restart mission start over the mission. Should ask for confirmation.
- [ ] Quit mission return to summary page. Should ask for confirmation.

**Save game**
- [ ] Save game on empty slot.
- [ ] Save game on a not empty slot.

**Load game**
- [ ] Load game load the game correctly.
	
**Objectives**

- [ ] Objectives shows the current maps objectve. Depend if it is skirmish or campaign map.

**Encyclopedia**
- [ ] Encyclopedia (more detail needed)

**Settings**
- [ ] Volume setting changes the sfx volume.
- [ ] Music settings changes the music volume.
- [ ] Scroll speed. → Details needed
- [ ] Delayed scroll → Details needed

#### Gameplay
**Mining**
- [ ] Miners automatically start mining when mining station is constructed, and they are in mining event.
- [ ] Miners automatically start mining when mining station supply is below the maximum level.
- [ ] Miners automatically search another asteroid when the mined asteroid depleeded.
- [ ] Asteroid shows mineral quantity left correctly.
- [ ] Asteroid shows the actual miner count correctly. (With different species also)

**Mining / Cargo**
- [ ] Cargo management working as expected. (which mineral is first)
- [ ] Cargo ships can be attach to any owned mining station.
- [ ] Cargo ships have a maximum capacity (currently its 100)
- [ ] Minerals decrease correctly in mining station, depend the quantity that cargo ships take out.

#### Missions
**Chapter one**
- [ ] Chapter one ; Mission 1 completed, no blocking issue found, all scripts run well.
- [ ] Chapter one ; Mission 2 completed, no blocking issue found, all scripts run well.
- [ ] Chapter one ; Mission 3 completed, no blocking issue found, all scripts run well.
- [ ] Chapter one ; Mission 4 completed, no blocking issue found, all scripts run well.
- [ ] Chapter one ; Mission 5 completed, no blocking issue found, all scripts run well.

#### Unit Events
**Movement**
- [ ] Fighter, worker type units can move through any object.
- [ ] Any non-fighter,-worker units calculate their routes, cannot move through any object.
- [ ] Units can be moved through minimap. (set the movement target position on minimap)

**Attack**

**Follow**
- [ ] Following a unit is working.

**Patroll**
- [ ] Patrolling is working between the current position and the selected point. While patrolling the units attacks enemy units.

**Stop**
- [ ] Stop all running unit events. (Attack, Follow, Patroll, Stop, Dock)

**Hold position**
- [ ] Stop all running unit events. (Attack, Follow, Patroll, Stop, Dock)

**Dock**
- [ ] Dockable units can dock into a carrier with right clicking on a carrier or pressing dock controll button, or „D” hotkey. 
- [ ] Maximum capacity cannot be exceeded, hangar capacity indicator show the correct ducked unit number.
- [ ] Damaged docked units are healing. 

**Undock**
- [ ] Pressing undock controll button or „U” hotkey undock all docked units. 
- [ ] Undocking a unit while healed is still damaged.
- [ ] Clicking on a docked unit showed in carriers HUD undock that unit.

**Deploy**
- [ ] Deploy is working with controll button and with hotkey. If controll button or hotkey is pressed the main base is shown.
Main base must belong to the correct species.

**Change mode**
- [ ] Changing mode while stopped with controll button and with hotkey. Changing mode from undeployed to deployed and from deployed to undeployed.
- [ ] Changing mode while moving stops unit and then it changes mode. Deployed units cannot move.

**Unit sounds**

- [ ] Selecting a unit plays its „selected” sound.
- [ ] Moving a unit plays its „Move” sound.
- [ ] Attacking with a unit plays its „attack” sound.
