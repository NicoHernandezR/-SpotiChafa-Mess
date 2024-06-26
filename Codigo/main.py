from sqlite3 import connect
from pytube import Playlist
from pytube import YouTube
from pathlib import Path
import shutil
import random
import os
import traceback
import base64
from supabase import create_client, Client
from dotenv import load_dotenv

class BD:

    def __init__(self):
        print("INIT")
        load_dotenv()
        self.conn : connect = None
        self.cursor = None
        self.abrir_conexion()
        self.cursor = self.conn.cursor()
        self.crear_tabla_cancion()
        self.crear_tabla_playlist()
        self.crear_tabla_current_pl()
        self.url_supabase = os.getenv('url_supabase')
        self.key_supabase = os.getenv('key_supabase') 
        self.supabase: Client = create_client(self.url_supabase, self.key_supabase)

    def abrir_conexion(self):
        self.conn = None
        self.conn = connect('ListaCanciones.db',check_same_thread=False)

    def hacer_commit(self):
        self.conn.commit()
    def ejecutar_query(self, query, par=None):
        if par == None:
            self.cursor.execute(query)
        else:
            self.cursor.execute(query,par)
        self.hacer_commit()


    def crear_tabla_cancion(self):
        query = '''
            CREATE TABLE IF NOT EXISTS cancion (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                artista TEXT
            )
        '''
        self.ejecutar_query(query)

    def crear_tabla_playlist(self):
        query = '''
            CREATE TABLE IF NOT EXISTS playlist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT
            )
        '''
        self.ejecutar_query(query)

    def crear_tabla_current_pl(self):
        query = '''
            CREATE TABLE IF NOT EXISTS current_pl (
                pl TEXT
            )
        '''
        self.ejecutar_query(query)

    def insert_url(self, url:str):
        query = 'INSERT INTO playlist (url) VALUES (?)'
        values = (url,)
        self.ejecutar_query(query,values)

    def insert_cancion(self,nom:str, art:str):
        query = 'INSERT INTO cancion (nombre, artista) VALUES (?,?)'
        values = (nom, art)
        self.ejecutar_query(query,values)

    def insert_current_pl(self, pl):
        query = 'INSERT INTO current_pl (pl) VALUES (?)'
        values = (pl,)
        self.ejecutar_query(query,values)
    def generar_urls(self,playlist):
        playlist_urls : list = Playlist(playlist)
        for url in playlist_urls:
            self.insert_url(url)


    def selecionar_current_pl(self):
        query = 'SELECT pl FROM current_pl'
        self.ejecutar_query(query)
        pl = self.cursor.fetchone()
        return pl[0] if pl else None
    def selecionar_cancion(self,id):
        query = f'SELECT nombre, artista FROM cancion WHERE id = {id}'
        self.ejecutar_query(query)
        cancion = self.cursor.fetchall()
        return cancion[0][0]
    
    def seleccionar_id_cancion(self, nom, art):
        query = 'SELECT id FROM cancion WHERE nombre = ? AND artista = ?'
        self.ejecutar_query(query, (nom, art))
        id_can = self.cursor.fetchone()
        return id_can[0] if id_can else None
    
    def seleccionar_url(self,id):
        query = f'SELECT url FROM playlist WHERE id = {id}'
        self.ejecutar_query(query)
        url = self.cursor.fetchall()
        return url[0][0]
    
    def total_url_playlist(self):
        query = 'SELECT COUNT(*) FROM playlist'
        self.ejecutar_query(query)
        total = self.cursor.fetchall()
        return total[0][0]
    
    def borrar_listado(self):
        query = 'DROP TABLE IF EXISTS playlist'
        self.ejecutar_query(query)

    def borrar_canciones(self):
        query = 'DROP TABLE IF EXISTS cancion'
        self.ejecutar_query(query)
        shutil.rmtree("canciones")

    def borrar_current_pl(self):
        query = 'DELETE FROM current_pl'
        self.ejecutar_query(query)


    def descargar_audio(self,url:str):
        try:
            yt = YouTube(url)

            #Descargar solo Audio
            video = yt.streams.filter(only_audio=True).first()
            art = yt.author
            nom = video.title
            self.insert_cancion(nom,art)
            id_can = self.seleccionar_id_cancion(nom, art)
            destination = "canciones"

            # download the file
            out_file = video.download(output_path=destination)
            new_file = "canciones" + '\\' + str(id_can) + '.mp3'
            ruta = Path(out_file)
            ruta.rename(new_file)
        except Exception as e:
            print(f"Error al descargar el audio: {e}")
            traceback.print_exc()

    def hacer_todo_el_insert(self, pl, cant):
        if os.path.exists("canciones"):
            shutil.rmtree("canciones")

        total = self.total_url_playlist()
        current_pl = self.selecionar_current_pl()
        if current_pl == None or current_pl != pl:
            self.generar_urls(pl)
            self.borrar_current_pl()
            self.insert_current_pl(pl)
            total = self.total_url_playlist()

        random_indices = random.sample(range(1, total + 1), cant)

        for index in random_indices:
            url = self.seleccionar_url(index)
            self.descargar_audio(url)
        
        self.vaciar_tabla_supabase()
        self.subir_a_supabase()
    def vaciar_tabla_supabase(self):
            try:
                # Realizar la solicitud POST
                data, count = self.supabase.table('tabla_mp3').delete().gt('id', 0).execute()
            except Exception as e:
                print(f'Error al procesar: {str(e)}')

    def subir_a_supabase(self):
        source_folder = 'canciones'  # Reemplaza con la ruta de tu carpeta
        files = os.listdir(source_folder)

        for file_name in files:
            # Construir la ruta completa al archivo
            file_path = os.path.join(source_folder, file_name)

            nom = self.selecionar_cancion(file_name.replace(".mp3", ""))

            # Leer el archivo MP3 en formato binario
            with open(file_path, 'rb') as mp3_file:
                mp3_binary = mp3_file.read()

            mp3_base64_str = base64.b64encode(mp3_binary).decode('utf-8')

            try:
                # Realizar la solicitud POST
                data, count = self.supabase.table('tabla_mp3').insert({"nombre_archivo": nom, 
                                                                "archivo_mp3" : mp3_base64_str}).execute()

            except Exception as e:
                print(f'Error al procesar {file_name}: {str(e)}')
    
        self.borrar_canciones()



if __name__ == "__main__":

    bd = BD()
    bd.hacer_todo_el_insert('https://www.youtube.com/playlist?list=PLyHdxlKXBjjnAQ4tcta35jkaFKLosZIJ-', 5)