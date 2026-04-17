import { useState, useRef, useEffect } from "react";
import routerAvatar from "./assets/router-avatar.svg";
import personAvatar from "./assets/person-avatar.svg";

/* eslint-disable no-undef */
const APP_VERSION = typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "1.001";

const LED_KNOWLEDGE_BASE = [
  {"stateCode":"01-01-03-01-02-001","mode":"親機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"電源が入っているとき"},
  {"stateCode":"01-01-02-03-02-001","mode":"親機","ledPosition":"POWER","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"WPSでWi-Fi設定をしているとき"},
  {"stateCode":"01-01-02-02-02-001","mode":"親機","ledPosition":"POWER","ledStatus":"点滅","blinkSpeed":"低速","ledColor":"緑","deviceCondition":"WANポートのリンク速度を1Gbpsに制限しているとき"},
  {"stateCode":"01-01-03-01-03-001","mode":"親機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"ファームウェアをバージョンアップしているとき"},
  {"stateCode":"01-01-03-01-03-002","mode":"親機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"設定情報の保存をしているとき"},
  {"stateCode":"01-01-03-01-03-003","mode":"親機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"WPSでWi-Fi設定が完了したとき"},
  {"stateCode":"01-01-03-01-04-001","mode":"親機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"WPSでWi-Fi設定に失敗したとき"},
  {"stateCode":"01-01-02-03-04-001","mode":"親機","ledPosition":"POWER","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"赤","deviceCondition":"RESETスイッチによる初期化が完了したとき"},
  {"stateCode":"01-01-02-04-04-001","mode":"親機","ledPosition":"POWER","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"赤","deviceCondition":"WPSでWi-Fi設定に失敗したとき"},
  {"stateCode":"01-01-01-01-01-001","mode":"親機","ledPosition":"POWER","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"電源が入っていないとき"},
  {"stateCode":"01-01-01-01-01-002","mode":"親機","ledPosition":"POWER","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「全消灯」に設定しているとき"},
  {"stateCode":"01-02-03-01-02-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"PPPoEルータモードの場合にPPPリンクが確立しWAN側にIPアドレスが設定されているとき"},
  {"stateCode":"01-02-03-01-02-002","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"ローカルルータモードの場合にWAN側にIPアドレスが設定されているとき"},
  {"stateCode":"01-02-03-01-02-003","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"IPv4 over IPv6通信モードの場合にIPv4 over IPv6通信が確立しているとき"},
  {"stateCode":"01-02-02-04-02-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"緑","deviceCondition":"PPPoEルータモードの場合に相手からの応答を確認しているとき"},
  {"stateCode":"01-02-02-04-02-002","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"緑","deviceCondition":"IPv4 over IPv6通信モードの場合にIPv4 over IPv6通信が確立待ちのとき"},
  {"stateCode":"01-02-02-02-02-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点滅","blinkSpeed":"低速","ledColor":"緑","deviceCondition":"PPPoEルータモードの場合にPPP認証を再確認しているとき（1秒間隔）"},
  {"stateCode":"01-02-03-01-03-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"ブリッジモードのとき"},
  {"stateCode":"01-02-02-03-03-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"橙","deviceCondition":"強制DHCPサーバ機能が動作しているとき"},
  {"stateCode":"01-02-02-04-04-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"赤","deviceCondition":"ルータモードでIPアドレスがWAN側のIPアドレスと競合しているとき"},
  {"stateCode":"01-02-02-02-04-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"点滅","blinkSpeed":"低速","ledColor":"赤","deviceCondition":"IPv4 over IPv6通信モードの場合に、回線自動判定の結果、一時的にインターネット通信ができないことを検知したとき"},
  {"stateCode":"01-02-01-01-01-001","mode":"親機","ledPosition":"ACTIVE","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"PPPoEルータモードの場合にPPPリンクが確立していないとき"},
  {"stateCode":"01-02-01-01-01-002","mode":"親機","ledPosition":"ACTIVE","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"ローカルルータモードの場合にWAN側にIPアドレスが設定されていないとき"},
  {"stateCode":"01-02-01-01-01-003","mode":"親機","ledPosition":"ACTIVE","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"01-03-03-01-02-001","mode":"親機","ledPosition":"2.4GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"2.4GHz帯で通信可能なとき"},
  {"stateCode":"01-03-02-04-02-001","mode":"親機","ledPosition":"2.4GHz","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"緑","deviceCondition":"2.4GHz帯でデータ送受信しているとき"},
  {"stateCode":"01-03-01-01-01-001","mode":"親機","ledPosition":"2.4GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"Wi-Fiを使用していないとき"},
  {"stateCode":"01-03-01-01-01-002","mode":"親機","ledPosition":"2.4GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"01-04-03-01-02-001","mode":"親機","ledPosition":"5GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"5GHz帯で通信可能なとき"},
  {"stateCode":"01-04-02-04-02-001","mode":"親機","ledPosition":"5GHz","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"緑","deviceCondition":"5GHz帯でデータ送受信しているとき"},
  {"stateCode":"01-04-02-02-03-001","mode":"親機","ledPosition":"5GHz","ledStatus":"点滅","blinkSpeed":"低速","ledColor":"橙","deviceCondition":"5GHz帯がW53、W56で動作している場合に、干渉する電波（レーダー波）がないか検出しているとき"},
  {"stateCode":"01-04-01-01-01-001","mode":"親機","ledPosition":"5GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"Wi-Fiを使用していないとき"},
  {"stateCode":"01-04-01-01-01-002","mode":"親機","ledPosition":"5GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"01-05-03-01-02-001","mode":"親機","ledPosition":"6GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"6GHz帯で通信可能なとき"},
  {"stateCode":"01-05-02-04-02-001","mode":"親機","ledPosition":"6GHz","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"緑","deviceCondition":"6GHz帯でデータ送受信しているとき"},
  {"stateCode":"01-05-01-01-01-001","mode":"親機","ledPosition":"6GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"Wi-Fiを使用していないとき"},
  {"stateCode":"01-05-01-01-01-002","mode":"親機","ledPosition":"6GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"01-06-03-01-02-001","mode":"親機","ledPosition":"MESH","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"メッシュ親機として起動しているとき"},
  {"stateCode":"01-06-01-01-01-001","mode":"親機","ledPosition":"MESH","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"メッシュWi-Fiを使用していないとき"},
  {"stateCode":"01-06-01-01-01-002","mode":"親機","ledPosition":"MESH","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"01-07-02-03-02-001","mode":"親機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"ボタンによるファームウェアバージョンアップで、最新のファームウェアが適用済みであることを確認したとき"},
  {"stateCode":"01-07-03-01-03-001","mode":"親機","ledPosition":"OPTION","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"遠隔サポート許諾状態（2025年12月現在遠隔サポートは開始していません。）"},
  {"stateCode":"01-07-02-03-03-001","mode":"親機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"橙","deviceCondition":"ボタンでファームウェアをバージョンアップしているとき（0.5秒間隔）"},
  {"stateCode":"01-07-02-04-03-001","mode":"親機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"橙","deviceCondition":"遠隔サポート許諾確認中（2025年12月現在遠隔サポートは開始していません。）"},
  {"stateCode":"01-07-02-03-04-001","mode":"親機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"赤","deviceCondition":"ボタンによるファームウェアバージョンアップで、最新のファームウェアが取得できなかったとき"},
  {"stateCode":"01-07-01-01-01-001","mode":"親機","ledPosition":"OPTION","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"02-01-03-01-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"電源が入っているとき"},
  {"stateCode":"02-01-02-02-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点滅","blinkSpeed":"低速","ledColor":"緑","deviceCondition":"WPSでWi-Fi設定をしているとき"},
  {"stateCode":"02-01-03-01-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"ファームウェアをバージョンアップしているとき"},
  {"stateCode":"02-01-03-01-03-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"設定情報の保存をしているとき"},
  {"stateCode":"02-01-03-01-03-003","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"WPSでWi-Fi設定が完了したとき"},
  {"stateCode":"02-01-03-01-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"WPSでWi-Fi設定に失敗したとき"},
  {"stateCode":"02-01-02-03-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"赤","deviceCondition":"RESETスイッチによる初期化が完了したとき"},
  {"stateCode":"02-01-03-01-04-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"WPSでWi-Fi設定に失敗したとき"},
  {"stateCode":"02-01-01-01-01-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"電源が入っていないとき"},
  {"stateCode":"02-01-01-01-01-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"POWER","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「全消灯」に設定しているとき"},
  {"stateCode":"02-02-03-01-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"ACTIVE","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"親機とのリンクが有線、5GHz帯または6GHz帯のWi-Fiで確立しているとき"},
  {"stateCode":"02-02-03-01-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"ACTIVE","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"親機とのリンクが2.4GHz帯のWi-Fiで確立しているとき"},
  {"stateCode":"02-02-02-03-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"ACTIVE","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"橙","deviceCondition":"強制DHCPサーバ機能が動作しているとき"},
  {"stateCode":"02-02-01-01-01-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"ACTIVE","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"親機とのリンクが確立していないとき"},
  {"stateCode":"02-02-01-01-01-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"ACTIVE","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"02-03-03-01-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"2.4GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「強」で、通信可能なとき"},
  {"stateCode":"02-03-03-01-02-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"2.4GHz帯以外のWi-Fiまたは有線で親機とリンクしている場合、2.4GHz帯で子機、中継機と通信可能なとき"},
  {"stateCode":"02-03-03-01-02-003","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"メッシュ機能を利用しない中継機／子機で強制DHCPサーバ機能が起動しているとき（Wi-Fi設定引越し機能起動時を含む）"},
  {"stateCode":"02-03-02-03-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"2.4GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「強」で、データ送受信しているとき"},
  {"stateCode":"02-03-02-03-02-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"2.4GHz帯以外のWi-Fiまたは有線で親機とリンクしている場合、2.4GHz帯で子機、中継機とデータ送受信しているとき"},
  {"stateCode":"02-03-03-01-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"2.4GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「中」で、通信可能なとき"},
  {"stateCode":"02-03-02-03-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"橙","deviceCondition":"2.4GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「中」で、データ送受信しているとき"},
  {"stateCode":"02-03-03-01-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"2.4GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「弱」で、通信可能なとき"},
  {"stateCode":"02-03-03-01-04-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"2.4GHz帯のWi-Fi設定引越しに失敗したとき"},
  {"stateCode":"02-03-02-03-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"赤","deviceCondition":"2.4GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「弱」で、データ送受信しているとき"},
  {"stateCode":"02-03-01-01-01-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"2.4GHz帯の電波が届いていないとき"},
  {"stateCode":"02-03-01-01-01-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"Wi-Fi接続設定がされていないとき"},
  {"stateCode":"02-03-01-01-01-003","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"2.4GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"02-04-03-01-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"5GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「強」で、通信可能なとき"},
  {"stateCode":"02-04-03-01-02-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"5GHz帯以外のWi-Fiまたは有線で親機とリンクしている場合、5GHz帯で子機、中継機と通信可能なとき"},
  {"stateCode":"02-04-03-01-02-003","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"メッシュ機能を利用しない中継機／子機で強制DHCPサーバ機能が起動しているとき（Wi-Fi設定引越し機能起動時を含む）"},
  {"stateCode":"02-04-02-03-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"5GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「強」で、データ送受信しているとき"},
  {"stateCode":"02-04-02-03-02-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"5GHz帯以外のWi-Fiまたは有線で親機とリンクしている場合、5GHz帯で子機、中継機とデータ送受信しているとき"},
  {"stateCode":"02-04-03-01-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"5GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「中」で、通信可能なとき"},
  {"stateCode":"02-04-02-03-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"橙","deviceCondition":"5GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「中」で、データ送受信しているとき"},
  {"stateCode":"02-04-02-02-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点滅","blinkSpeed":"低速","ledColor":"橙","deviceCondition":"5GHz帯がW53、W56で動作している場合に、干渉する電波（レーダー波）がないか検出しているとき"},
  {"stateCode":"02-04-03-01-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"5GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「弱」で、通信可能なとき"},
  {"stateCode":"02-04-03-01-04-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"5GHz帯のWi-Fi設定引越しに失敗したとき"},
  {"stateCode":"02-04-02-03-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"赤","deviceCondition":"5GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「弱」で、データ送受信しているとき"},
  {"stateCode":"02-04-01-01-01-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"5GHz帯の電波が届いていないとき"},
  {"stateCode":"02-04-01-01-01-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"Wi-Fi接続設定がされていないとき"},
  {"stateCode":"02-04-01-01-01-003","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"5GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"02-05-03-01-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"6GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「強」で、通信可能なとき"},
  {"stateCode":"02-05-03-01-02-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"6GHz帯以外のWi-Fiまたは有線で親機とリンクしている場合、6GHz帯で子機、中継機と通信可能なとき"},
  {"stateCode":"02-05-03-01-02-003","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"メッシュ機能を利用しない中継機／子機で強制DHCPサーバ機能が起動しているとき（Wi-Fi設定引越し機能起動時を含む）"},
  {"stateCode":"02-05-02-03-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"6GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「強」で、データ送受信しているとき"},
  {"stateCode":"02-05-02-03-02-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"6GHz帯以外のWi-Fiまたは有線で親機とリンクしている場合、6GHz帯で子機、中継機とデータ送受信しているとき"},
  {"stateCode":"02-05-03-01-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"6GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「中」で、通信可能なとき"},
  {"stateCode":"02-05-02-03-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"橙","deviceCondition":"6GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「中」で、データ送受信しているとき"},
  {"stateCode":"02-05-02-02-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点滅","blinkSpeed":"低速","ledColor":"橙","deviceCondition":"6GHz帯がW53、W56で動作している場合に、干渉する電波（レーダー波）がないか検出しているとき"},
  {"stateCode":"02-05-03-01-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"赤","deviceCondition":"6GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「弱」で、通信可能なとき"},
  {"stateCode":"02-05-02-03-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"赤","deviceCondition":"6GHz帯のWi-Fiで親機とリンクしている場合、親機との電波強度が「弱」で、データ送受信しているとき"},
  {"stateCode":"02-05-01-01-01-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"6GHz帯の電波が届いていないとき"},
  {"stateCode":"02-05-01-01-01-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"Wi-Fi接続設定がされていないとき"},
  {"stateCode":"02-05-01-01-01-003","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"6GHz","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"02-06-03-01-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"MESH","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"橙","deviceCondition":"メッシュ中継機として起動しているとき"},
  {"stateCode":"02-06-01-01-01-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"MESH","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"メッシュWi-Fiを使用していないとき"},
  {"stateCode":"02-06-01-01-01-002","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"MESH","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"},
  {"stateCode":"02-07-03-01-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"OPTION","ledStatus":"点灯","blinkSpeed":"なし","ledColor":"緑","deviceCondition":"メッシュ中継機またはメッシュ機能を使用しない中継機／子機として動作しているとき"},
  {"stateCode":"02-07-02-03-02-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"緑","deviceCondition":"ボタンによるファームウェアバージョンアップで、最新のファームウェアが適用済みであることを確認したとき"},
  {"stateCode":"02-07-02-03-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"橙","deviceCondition":"ボタンでファームウェアをバージョンアップしているとき（0.5秒間隔）"},
  {"stateCode":"02-07-02-04-03-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"高速","ledColor":"橙","deviceCondition":"遠隔サポート許諾確認中（2025年12月現在遠隔サポートは開始していません。）"},
  {"stateCode":"02-07-02-03-04-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"OPTION","ledStatus":"点滅","blinkSpeed":"中速","ledColor":"赤","deviceCondition":"ボタンによるファームウェアバージョンアップで、最新のファームウェアが取得できなかったとき"},
  {"stateCode":"02-07-01-01-01-001","mode":"メッシュ中継機またはメッシュ機能を利用しない中継機／子機","ledPosition":"OPTION","ledStatus":"消灯","blinkSpeed":"なし","ledColor":"なし","deviceCondition":"状態表示ランプ点灯設定を「POWERランプのみ点灯」または「全消灯」に設定しているとき"}
];

const SYSTEM_PROMPT = `あなたはNECプラットフォームズ社製ネットワーク製品「Atermシリーズ」の機器状態を診断するAIアシスタントです。

## 厳守事項：診断の根拠
機器の状態判定は、必ず以下に示す「LEDランプ状態ナレッジベース」のみを根拠とすること。ナレッジベースに存在しない組み合わせについては「該当する状態がナレッジベースに見つかりませんでした。」と返答し、独自の推測で状態を判定してはならない。

## LEDランプ状態ナレッジベース
各レコードは mode（利用モード）、ledPosition（ランプ種類）、ledStatus（点灯状態）、blinkSpeed（点滅速度）、ledColor（発光色）、deviceCondition（機器の状態）の6項目で構成される。

${JSON.stringify(LED_KNOWLEDGE_BASE, null, 2)}

## 診断手順
1. ユーザーが提示した「利用モード」「ledPosition」「ledStatus」「blinkSpeed」「ledColor」の組み合わせでナレッジベースを検索する
2. 一致するレコードの deviceCondition を返答する
3. 同じ組み合わせに複数のレコードが存在する場合は、すべての deviceCondition を列挙する
4. 画像が提供された場合は、下記「LEDランプ位置とランプ種類の対応関係」を参照してランプ種類を特定したうえで、各ランプの色・点灯状態・点滅の有無を詳細に観察し、対応する項目をナレッジベースで検索する

## LEDランプ位置とランプ種類の対応関係
画像からLEDランプの状態を判断する際は、機器上のランプの物理的な位置と以下の対応でledPositionを特定すること。
- 1番上       → POWER
- 上から2番目  → ACTIVE
- 上から3番目  → 2.4GHz
- 真ん中      → 5GHz
- 下から3番目  → 6GHz
- 下から2番目  → MESH
- 1番下       → OPTION

## 判定ルール（厳守事項）

1. ユーザーが機器の利用モードを明示していない場合：
   「お使いの機器の利用モードをお教えください。LEDランプが点滅している際は、その旨もお教えください。」

2. ユーザーが機器の情報または機器の状態と明らかに無関係な質問をした場合（天気、料理、一般知識など）：
   「申し訳ございません。機器の情報と無関係な質問にはお答えできません。」とのみ返答する。
   この判定は画像の有無や内容に関わらず最優先とする。

3. ユーザーのチャット文言と画像から判定した内容が矛盾する場合：
   「画像とご質問内容が一致しません。もう一度お確かめの上ご質問ください。」とのみ返答する。

4. LEDが点滅か点灯か判断ができない場合：
   「LEDの状態は点滅ですか？点灯ですか？」と回答する。

## 回答形式
診断結果は以下の形式で返答する：
- https://uatdev01.z11.web.core.windows.net/assets/diagnosis.png を配置（width:64px;hight:64px)
- **診断結果**：deviceCondition の内容（複数該当する場合はすべて列挙）
- 区切りを入れる
- https://uatdev01.z11.web.core.windows.net/assets/supplementary.png を配置（width:64px;hight:64px)
- **補足情報*（必要な場合のみ）：追加の説明

画像が提供された場合は、観察したLEDランプの状態（ランプ種類・点灯状態・点滅速度・発光色）も診断結果の前に明示すること。
LEDの説明は、色の説明だけでなく、🔴＝赤、🟠＝橙、⚪️＝消灯、🟢＝緑 のマークでも表現する
診断結果に対して、その対処についても可能な範囲で案内をする。
参考にすべきURLがあれば、それも案内する。
`;

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "ご利用の機器の利用モード（親機・子機・中継機）をお知らせください。LEDランプの点灯状態が写った画像を送信いただくと、より正確な診断が可能です。LEDランプが点滅している場合、あわせてお知らせください。",
  id: "init"
};

export default function App() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [pendingAutoSend, setPendingAutoSend] = useState(null);
  const bottomRef = useRef(null);
  const sendMessageRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (pendingAutoSend) {
      setPendingAutoSend(null);
      sendMessageRef.current(pendingAutoSend, null);
    }
  }, [pendingAutoSend]);

  const openCamera = async () => {
    setCameraError(null);
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError("カメラへのアクセスが許可されていません");
    }
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const base64 = dataUrl.split(",")[1];
    setImage({ base64, type: "image/jpeg" });
    setImagePreview(dataUrl);
    closeCamera();
  };

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage({ file, base64: e.target.result.split(",")[1], type: file.type });
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const modeConfirmed = messages.some(
    m => m.role === "user" && /親機|子機|中継機/.test(m.content)
  );
  const handleSend = async () => {
    if (!input.trim() && !image) return;
    const modePrefix = selectedMode ? `モード＝${selectedMode}\n` : "";
    await sendMessage(modePrefix + input.trim(), image);
    setInput("");
    setImage(null);
    setImagePreview(null);
    setSelectedMode(null);
  };

  const sendMessage = async (userText, userImage) => {
    const userMsg = {
      role: "user",
      content: userText,
      image: userImage ? imagePreview : null,
      id: Date.now().toString()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const apiMessages = messages
        .filter(m => m.id !== "init")
        .map(m => {
          if (m.role === "user" && m.image) {
            return {
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: m.imageType || "image/jpeg", data: m.imageBase64 } },
                { type: "text", text: m.content || "画像を送信" }
              ]
            };
          }
          return {
            role: m.role,
            content: [
              { type: "text", text: m.content }
            ]
          };
          //return { role: m.role, content: m.content };
        });

      // Add current message
      if (userImage) {
        apiMessages.push({
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: userImage.type, data: userImage.base64 } },
            { type: "text", text: userText || "この画像のLEDランプ状態を診断してください。" }
          ]
        });
      } else {
        apiMessages.push({
          role: "user",
          content: [
            { type: "text", text: userText }
          ]
        });
        //apiMessages.push({ role: "user", content: userText });
      }

      const response = await fetch("https://uatdev01.azurewebsites.net/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages
        })
      });

      const data = await response.json();
      const assistantText = data?.content?.[0]?.text || "エラーが発生しました。もう一度お試しください。";
      //const assistantText = data.content?.map(b => b.text || "").join("") || "エラーが発生しました。";

      const assistantMsg = {
        role: "assistant",
        content: assistantText,
        id: (Date.now() + 1).toString()
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Store image data for future context
      setMessages(prev => prev.map(m =>
        m.id === userMsg.id
          ? { ...m, imageBase64: userImage?.base64, imageType: userImage?.type }
          : m
      ));
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "エラーが発生しました。もう一度お試しください。",
        id: (Date.now() + 1).toString(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  sendMessageRef.current = sendMessage;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    setInput("");
    setImage(null);
    setImagePreview(null);
    setSelectedMode(null);
  };

  const renderMarkdown = (text) => {
    // コードブロック（```）を先に抽出して保護
    const codeBlocks = [];
    const withCodeBlocks = text.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
      codeBlocks.push({ lang, code: code.trim() });
      return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });

    // インラインコード（`code`）
    const inlineCodeMap = [];
    const withInlineCode = withCodeBlocks.replace(/`([^`]+)`/g, (_, code) => {
      inlineCodeMap.push(code);
      return `%%INLINECODE_${inlineCodeMap.length - 1}%%`;
    });

    const lines = withInlineCode.split("\n");
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // コードブロックの復元
      const cbMatch = line.match(/^%%CODEBLOCK_(\d+)%%$/);
      if (cbMatch) {
        const { code } = codeBlocks[Number(cbMatch[1])];
        elements.push(
          <pre key={i} style={{ background: "#f0f4f8", border: "1px solid #d0dce8", borderRadius: "6px", padding: "10px 14px", overflowX: "auto", fontSize: "12px", margin: "6px 0" }}>
            <code style={{ fontFamily: "monospace", color: "#2d4a6e" }}>{code}</code>
          </pre>
        );
        i++;
        continue;
      }

      // 見出し h1〜h4
      const h4 = line.match(/^####\s+(.+)/);
      const h3 = line.match(/^###\s+(.+)/);
      const h2 = line.match(/^##\s+(.+)/);
      const h1 = line.match(/^#\s+(.+)/);
      if (h1 || h2 || h3 || h4) {
        const [match, size] = h1 ? [h1, "16px"] : h2 ? [h2, "15px"] : h3 ? [h3, "14px"] : [h4, "13px"];
        elements.push(<div key={i} style={{ fontWeight: "bold", fontSize: size, margin: "8px 0 4px", color: "#1a3a5c" }} dangerouslySetInnerHTML={{ __html: inlineFormat(match[1], inlineCodeMap) }} />);
        i++;
        continue;
      }

      // 水平線
      if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
        elements.push(<hr key={i} style={{ border: "none", borderTop: "1px solid #d0dce8", margin: "8px 0" }} />);
        i++;
        continue;
      }

      // テーブル（| で始まる行）
      if (/^\|/.test(line)) {
        const tableLines = [];
        while (i < lines.length && /^\|/.test(lines[i])) {
          tableLines.push(lines[i]);
          i++;
        }
        const parseRow = (row) => row.split("|").slice(1, -1).map(cell => cell.trim());
        const headerCells = parseRow(tableLines[0]);
        const bodyRows = tableLines.slice(2).filter(r => !/^\|[-\s|:]+\|$/.test(r));

        // 「選択肢」テーブルはボタン形式で表示
        const isChoiceTable = headerCells.some(c => c.includes("選択肢"));
        if (isChoiceTable) {
          const modes = bodyRows
            .map(row => parseRow(row)[0]?.replace(/[^\u4e00-\u9fa5ぁ-んァ-ヶa-zA-Z0-9]/g, "").trim())
            .filter(Boolean);
          elements.push(
            <div key={`choice_${i}`} style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "8px 0" }}>
              {modes.map(mode => (
                <button key={mode}
                  onClick={() => setPendingAutoSend(`モード＝${mode}`)}
                  style={{
                    padding: "7px 20px", borderRadius: "20px",
                    border: "1.5px solid #1a6fd4",
                    background: "#fff", color: "#1a6fd4",
                    fontSize: "13px", fontWeight: "500",
                    cursor: "pointer", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#1a6fd4"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a6fd4"; }}
                >
                  {mode}
                </button>
              ))}
            </div>
          );
          continue;
        }

        elements.push(
          <table key={`tbl_${i}`} style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px", margin: "8px 0" }}>
            <thead>
              <tr>
                {headerCells.map((cell, ci) => (
                  <th key={ci} style={{ border: "1px solid #c8d8ea", background: "#dde8f4", padding: "5px 10px", textAlign: "left", fontWeight: "bold", color: "#1a3a5c" }}
                    dangerouslySetInnerHTML={{ __html: inlineFormat(cell, inlineCodeMap) }} />
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyRows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#fff" : "#f4f8fd" }}>
                  {parseRow(row).map((cell, ci) => (
                    <td key={ci} style={{ border: "1px solid #c8d8ea", padding: "5px 10px", color: "#2d4a6e" }}
                      dangerouslySetInnerHTML={{ __html: inlineFormat(cell, inlineCodeMap) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
        continue;
      }

      // リスト（- / * / 番号付き）
      const isUnordered = /^[-*]\s+/.test(line);
      const isOrdered = /^\d+\.\s+/.test(line);
      if (isUnordered || isOrdered) {
        const items = [];
        while (i < lines.length && (isUnordered ? /^[-*]\s+/.test(lines[i]) : /^\d+\.\s+/.test(lines[i]))) {
          const itemText = lines[i].replace(/^[-*]\s+/, "").replace(/^\d+\.\s+/, "");
          items.push(<li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(itemText, inlineCodeMap) }} />);
          i++;
        }
        const Tag = isOrdered ? "ol" : "ul";
        elements.push(<Tag key={`list_${i}`} style={{ paddingLeft: "18px", margin: "4px 0" }}>{items}</Tag>);
        continue;
      }

      // 空行
      if (line.trim() === "") {
        elements.push(<div key={i} style={{ height: "6px" }} />);
        i++;
        continue;
      }

      // 通常段落
      elements.push(<p key={i} style={{ margin: "2px 0", lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: inlineFormat(line, inlineCodeMap) }} />);
      i++;
    }

    return elements;
  };

  const inlineFormat = (text, inlineCodeMap) => {
    return text
      .replace(/%%INLINECODE_(\d+)%%/g, (_, n) =>
        `<code style="background:#e8eef6;border-radius:3px;padding:1px 5px;font-size:12px;font-family:monospace;color:#2d4a6e">${inlineCodeMap[Number(n)]}</code>`)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
        `<img src="${src}" alt="${alt}" style="max-width:100%;border-radius:6px;vertical-align:middle;"/>`)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) =>
        `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#1a6fd4;text-decoration:underline;">${label}</a>`)
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<s>$1</s>");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f9",
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0",
    }}>
      <div style={{ width: "100%", maxWidth: "820px", display: "flex", flexDirection: "column", height: "100vh" }}>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap');
          @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none} }
          ::-webkit-scrollbar{width:4px}
          ::-webkit-scrollbar-track{background:#f0f0f0}
          ::-webkit-scrollbar-thumb{background:#c8d4e0;border-radius:2px}
          textarea{resize:none;outline:none;}
          textarea::placeholder{color:#aab8c8}
        `}</style>

        {/* Header */}
        <header style={{
          padding: "16px 28px",
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          display: "flex", alignItems: "center", gap: "14px",
          flexShrink: 0
        }}>
          <div style={{
            width: "40px", height: "40px",
            background: "linear-gradient(135deg, #1a6fd4, #3b9eff)",
            borderRadius: "10px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(26,111,212,0.25)",
            flexShrink: 0
          }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="6" width="20" height="12" rx="2" stroke="#ffffff" strokeWidth="1.6"/>
              <circle cx="7" cy="12" r="1.5" fill="#6effc0"/>
              <circle cx="11" cy="12" r="1.5" fill="#a8d8ff"/>
              <circle cx="15" cy="12" r="1.5" fill="#ffc870" opacity="0.8"/>
              <line x1="19" y1="10" x2="22" y2="8" stroke="#ffffff" strokeWidth="1.2"/>
            </svg>
          </div>
          <div>
            <div style={{ color: "#1a2740", fontSize: "15px", fontWeight: "700", letterSpacing: "0.3px" }}>
              Aterm 機器状態診断システム
            </div>
            <div style={{ color: "#7a90a8", fontSize: "11px", letterSpacing: "0.8px", marginTop: "1px" }}>
              DIAGNOSTIC AI
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c97a", boxShadow: "0 0 6px rgba(34,201,122,0.5)", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#22c97a", fontSize: "11px", fontWeight: "500" }}>ONLINE</span>
            </div>
            <span style={{ color: "#b0bcc8", fontSize: "10px", letterSpacing: "0.3px" }}>v{APP_VERSION}</span>
          </div>
        </header>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "24px 28px",
          display: "flex", flexDirection: "column", gap: "16px",
          background: "#f4f6f9"
        }}>
          {messages.map((msg) => (
            <div key={msg.id}>
              <div style={{
                animation: "fadeUp 0.25s ease",
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                gap: "10px", alignItems: "flex-start"
              }}>
                {/* Avatar */}
                <div style={{
                  width: "64px", height: "64px", borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                  overflow: "hidden"
                }}>
                  <img
                    src={msg.role === "user" ? personAvatar : routerAvatar}
                    alt={msg.role === "user" ? "ユーザー" : "AI"}
                    style={{ width: "64px", height: "64px" }}
                  />
                </div>

                <div style={{
                  maxWidth: "72%",
                  background: msg.role === "user"
                    ? "#1a6fd4"
                    : msg.isError
                      ? "#fff0f0"
                      : "#ffffff",
                  border: msg.role === "user"
                    ? "none"
                    : msg.isError
                      ? "1px solid #ffc8c8"
                      : "1px solid #e2e8f0",
                  borderRadius: msg.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                  padding: "12px 16px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
                }}>
                  {msg.image && (
                    <img src={msg.image} alt="添付画像"
                      style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "10px", maxHeight: "220px", objectFit: "contain", background: "#f8f8f8", border: "1px solid #e8e8e8" }}
                    />
                  )}
                  <div style={{
                    color: msg.role === "user" ? "#ffffff" : msg.isError ? "#c0392b" : "#2c3e50",
                    fontSize: "13.5px", lineHeight: "1.8"
                  }}>
                    {renderMarkdown(msg.content)}
                  </div>
                </div>
              </div>

              {/* モード選択ボタン：モード未確定かつ選択を促すメッセージの直後に表示 */}
              {msg.role === "assistant" && !modeConfirmed &&
                (msg.id === "init" || /利用モード|モードをお教え|モードをお知らせ/.test(msg.content)) && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", marginLeft: "74px" }}>
                  {["親機", "子機", "中継機"].map(mode => (
                    <button key={mode}
                      onClick={() => setPendingAutoSend(`モード＝${mode}`)}
                      style={{
                        padding: "7px 18px", borderRadius: "20px",
                        border: "1.5px solid #1a6fd4",
                        background: "#fff", color: "#1a6fd4",
                        fontSize: "13px", fontWeight: "500",
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1a6fd4"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a6fd4"; }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              )}

              {/* LED状態選択ボタン：モード確定済み かつ 点灯/点滅を問うメッセージの直後に表示 */}
              {msg.role === "assistant" && msg.id !== "init" && modeConfirmed &&
                /点滅.*点灯|点灯.*点滅/.test(msg.content) && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", marginLeft: "74px" }}>
                  {[{ label: "点灯", text: "点灯です" }, { label: "点滅", text: "点滅です" }].map(({ label, text }) => (
                    <button key={label}
                      onClick={() => setPendingAutoSend(text)}
                      style={{
                        padding: "7px 18px", borderRadius: "20px",
                        border: "1.5px solid #1a6fd4",
                        background: "#fff", color: "#1a6fd4",
                        fontSize: "13px", fontWeight: "500",
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1a6fd4"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a6fd4"; }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}

              {/* 点滅速度選択ボタン */}
              {msg.role === "assistant" && msg.id !== "init" &&
                /点滅の速度はどれくらい/.test(msg.content) && (
                <div style={{ display: "flex", gap: "8px", marginTop: "10px", marginLeft: "74px" }}>
                  {["低速", "中速", "高速"].map(speed => (
                    <button key={speed}
                      onClick={() => setPendingAutoSend(speed)}
                      style={{
                        padding: "7px 18px", borderRadius: "20px",
                        border: "1.5px solid #1a6fd4",
                        background: "#fff", color: "#1a6fd4",
                        fontSize: "13px", fontWeight: "500",
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1a6fd4"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a6fd4"; }}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              )}

              {/* 点滅ランプ選択ボタン */}
              {msg.role === "assistant" && msg.id !== "init" &&
                /点滅しているランプはどれ/.test(msg.content) && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "10px", marginLeft: "74px" }}>
                  {["POWER", "ACTIVE", "2.4GHz", "5GHz", "6GHz", "MESH", "OPTION"].map(lamp => (
                    <button key={lamp}
                      onClick={() => setPendingAutoSend(`${lamp}が点滅しています`)}
                      style={{
                        padding: "7px 14px", borderRadius: "20px",
                        border: "1.5px solid #1a6fd4",
                        background: "#fff", color: "#1a6fd4",
                        fontSize: "13px", fontWeight: "500",
                        cursor: "pointer", transition: "all 0.15s"
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#1a6fd4"; e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#1a6fd4"; }}
                    >
                      {lamp}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", animation: "fadeUp 0.25s ease" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.07)", overflow: "hidden", flexShrink: 0 }}>
                <img src={routerAvatar} alt="AI" style={{ width: "64px", height: "64px" }} />
              </div>
              <div style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "4px 16px 16px 16px", padding: "14px 18px", display: "flex", gap: "5px", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} style={{
                    width: "7px", height: "7px", borderRadius: "50%",
                    background: "#1a6fd4",
                    animation: `pulse 1.2s ${d}s infinite`
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          padding: "14px 28px 18px",
          borderTop: "1px solid #e2e8f0",
          background: "#ffffff",
          flexShrink: 0
        }}>
          {/* Image preview */}
          {imagePreview && (
            <div style={{ marginBottom: "10px", position: "relative", display: "inline-block" }}>
              <img src={imagePreview} alt="プレビュー"
                style={{ height: "70px", borderRadius: "8px", border: "1px solid #d0dce8", objectFit: "cover" }}
              />
              <button onClick={() => { setImage(null); setImagePreview(null); }} style={{
                position: "absolute", top: "-6px", right: "-6px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "#e05555", border: "2px solid #fff", color: "#fff",
                cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center"
              }}>×</button>
            </div>
          )}

          {/* Input box */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              border: dragOver ? "1.5px dashed #1a6fd4" : "1.5px solid #d0dce8",
              borderRadius: "12px",
              background: dragOver ? "#eef4fd" : "#fafcff",
              transition: "all 0.15s",
              padding: "4px 4px 4px 14px",
              display: "flex", alignItems: "flex-end", gap: "8px"
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="利用モードをお知らせください（例：親機モードです）。Ctrl+Enterで送信"
              rows={3}
              style={{
                flex: 1, background: "transparent", border: "none",
                color: "#2c3e50", fontSize: "13.5px", lineHeight: "1.7",
                padding: "10px 0 10px", fontFamily: "inherit"
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "8px 6px 8px 4px", flexShrink: 0 }}>
              {/* Image upload */}
              <button onClick={() => fileInputRef.current?.click()}
                title="画像を添付"
                style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: "#eef2f8", border: "1px solid #d0dce8",
                  color: "#4a7fc0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#dce8f8"; e.currentTarget.style.borderColor = "#a8c4e0"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#eef2f8"; e.currentTarget.style.borderColor = "#d0dce8"; }}
              >
                📎
              </button>
              {/* Camera */}
              <button onClick={openCamera}
                title="カメラで撮影"
                style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: "#eef2f8", border: "1px solid #d0dce8",
                  color: "#4a7fc0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "18px", transition: "all 0.15s"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#dce8f8"; e.currentTarget.style.borderColor = "#a8c4e0"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#eef2f8"; e.currentTarget.style.borderColor = "#d0dce8"; }}
              >
                📷
              </button>
              {/* Send */}
              <button onClick={handleSend} disabled={isLoading || (!input.trim() && !image)}
                style={{
                  width: "36px", height: "36px", borderRadius: "8px",
                  background: (isLoading || (!input.trim() && !image)) ? "#d8e4f0" : "linear-gradient(135deg,#1a6fd4,#3b9eff)",
                  border: "none",
                  cursor: (isLoading || (!input.trim() && !image)) ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px",
                  boxShadow: (isLoading || (!input.trim() && !image)) ? "none" : "0 2px 8px rgba(26,111,212,0.3)",
                  transition: "all 0.15s"
                }}
              >
                ➤
              </button>
            </div>
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => handleImageFile(e.target.files[0])}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
            <p style={{ color: "#a0b0c4", fontSize: "11px", margin: 0 }}>
              LEDランプが写った画像をドラッグ＆ドロップ、または 📎 から添付できます
            </p>
            <button
              onClick={handleClearChat}
              title="チャット履歴を消去"
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: "transparent",
                border: "1px solid #f0c0c0",
                borderRadius: "7px",
                color: "#c87070",
                fontSize: "11px", padding: "4px 10px",
                cursor: "pointer",
                transition: "all 0.15s",
                flexShrink: 0
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "#fff0f0";
                e.currentTarget.style.color = "#c0392b";
                e.currentTarget.style.borderColor = "#e8a0a0";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#c87070";
                e.currentTarget.style.borderColor = "#f0c0c0";
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
              会話をリセット
            </button>
          </div>
        </div>
        {/* Footer */}
        <div style={{ textAlign: "right", padding: "6px 28px 10px", flexShrink: 0 }}>
          <span style={{ color: "#b0bcc8", fontSize: "10px" }}>
            Copyright &copy; UNI-INFORMATION Co.,Ltd. All Rights Reserved.
          </span>
        </div>
      </div>

      {/* Camera modal */}
      {cameraOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#fff", borderRadius: "16px", padding: "20px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "14px",
            width: "min(90vw, 480px)"
          }}>
            <div style={{ fontWeight: "bold", fontSize: "15px", color: "#1a3a5c" }}>カメラ撮影</div>
            {cameraError ? (
              <p style={{ color: "#c0392b", fontSize: "13px", margin: 0 }}>{cameraError}</p>
            ) : (
              <video ref={videoRef} autoPlay playsInline
                style={{ width: "100%", borderRadius: "10px", background: "#000" }}
              />
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={capturePhoto} disabled={!!cameraError}
                style={{
                  padding: "10px 24px", borderRadius: "8px", border: "none",
                  background: cameraError ? "#d8e4f0" : "linear-gradient(135deg,#1a6fd4,#3b9eff)",
                  color: "#fff", fontSize: "14px", fontWeight: "bold",
                  cursor: cameraError ? "not-allowed" : "pointer"
                }}
              >
                📸 撮影
              </button>
              <button onClick={closeCamera}
                style={{
                  padding: "10px 24px", borderRadius: "8px",
                  border: "1px solid #d0dce8", background: "#f4f6f9",
                  color: "#4a7fc0", fontSize: "14px", cursor: "pointer"
                }}
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}