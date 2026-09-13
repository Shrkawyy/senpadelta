// ==UserScript==
// @name         HiddenX for delt.io
// @namespace    shrkawy.hiddenx.deltio
// @version      1.0.0
// @description  Inject HiddenX/XPRVT overlay on the real delt.io page without replacing the Delt client.
// @author       Local conversion
// @match        https://delt.io/*
// @match        https://www.delt.io/*
// @match        http://delt.io/*
// @match        http://www.delt.io/*
// @run-at       document-idle
// @noframes
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const HIDDENX_VERSION = '1.0.0';
  const CHAT_WS = 'wss://xprivt.onrender.com/chat';
  const ROOM = 'ffa:global';
  const KEY_STORAGE = 'ogx_key';
  const DEVICE_STORAGE = 'xprvt_device_id';
  const NAME_STORAGE = 'hiddenx_name';
  const NICK2_STORAGE = 'hiddenx_nickname2';
  const TAG_STORAGE = 'hiddenx_tag';
  const POS_STORAGE = 'hiddenx_panel_pos';
  const LOG_LIMIT = 120;
  const HIDDENX_LOGO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAa0AAABoCAIAAADNZjjTAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAFJkSURBVHhe7X0HgBzF0e7O7p0uSTpdUM45owxCYDLYGLCfwQbbgAk2yWQhJAE2+AeMJKKNAZMFBhsnsLENGINEVs4I5XCnnNPpJJ3udvZ9VdXT2zszmy4osd/1zfb0VFdXV1VX94Sdte4fNeqX9z8QDgbSQiQS0VsN7FqWFbCp0A7wIc5HrIAuDwQtbLAbDAaxlSqqYgbpwKX8ryEOvc9YEXJmm5sNxlG/nzPL6LLxj6NAyKISGSPBgGXbth4X2AqED7Y6L0chA4C6Xj66XPNUVXgrTJCRPLZ6F0BeCr9OUHYJ2QHrV6NG3ffIhIjYAQrirSuv1eMuj6M4KY9EwpYVkhLTHhqwGUVIzmueQCafel7GgIwNE9AsIOXHal58hwvS1lv6eYpiFo+c2DxB0yNOYr7HHC95LScGhMW0aghwORFg10Z8Uv2SWCaVMH5og0Mc12LGDo7oJgHfPGd0vMMHmgMfKklbb3H7CxwL+YgtEZFAM4nKggKLN+o85xWwj7yxq+znTuCMoIq5KJSFXW0/xxiUUFcGMCAlgkxekHqeJxLZxCT58OZRUeedD0YKeWk3FYgnxMsLT8XYyJs0Zt6kMfOKhpOgfvNoAMkpx0iR6Kby9OkAhWpCCtCJjhSSiAzeoaOIQTLKEJIoYnKJ7iwg40IdpfFC/Qxi0WeMHQ5kREx1hVjg5OmYwxPMdYvYJSFrozez74SjLs/KcZdDEUhUKDFeAI2rnB9UUHQgahX4VDRsS37MqicbSIlR18xn0HDQeoY1aq1zsiQZk5E4nzApdh64yHRShw85oKZUNAV9Imk5OSZxSNJZZ4yIfpiK8pIBdF6IBUaWoBgaEhE3p6LOANIoQRUQRJO69a8bknY8ZlozQDOAyjLMfR0TeZIjC/HyESmMFJEUtpFozR+2ATIKjkbCMYb0GAY7et/MZ1BHmHp26Rz20Capr/yxDfi/PjeCP5MbyxINXs6uTmDnF3qJYKCjxDtYE2CQCCEfV5R8ccqWcaHjlnDGhveIWAYUjSunOZ3RBJQhAZlRLET+rw/i9RfaUXpXwU3vORDtq8Q2NrdBvmARtGkXW0pYukfCdFmWbBkJBcEX63km461cXOa6tqqFQhuOYXAWuWgXxLx85ELajW4Ner1leqMkQ5+hrw96OuQkgz7EScppFMCNHV/VPk9DwKJylQI2+3wEWywIyPl5ICAhYlImDGJkuIrIQ/ydUQCeEYq2GD7C36HhZLRLwRcjkUccyUZVaFQyW7U15acSM8VS1nLrSOWUSN4saWB6M1FnbSSuqJIXfJ/k4UcoIDlAdtO6tWAhCEK3OH82trpcIBMOXRaB8eEUPCnBNyAZ7G5FsAxE5CQIMe+7eWpuBIvDNyzLgD2jf55atA3YtNVHo9QZ+gx97em1BwImvQkpCYVC8P8sBKtAmE57sMXSj5aAIRkddCQSrK6pUrytrGAIy0IctFCLF3Z2DWKc00qYRwkGQiii7jQqYGhEgqEsCy0KZ2nFjtSgHPUonAbCgRpFqWU2tyZQYsKXPu3t4bavCZRIUIKWsCsTSJu27WPiDcp84+CcadNeeu5ZHQq9IL5sBgdB2CWUnQXzHDx4MAxzMEBD052iFK/Su/EhDZsyJUaGPjEy9ImRLr0BODl5OxZstPpQTo+xSRkcxoSOlQBnEdWys7PlLkqNHdZRTJ8+45AUqkMsjogmYN70QAydfTFPKuQ1A8rNWmhLiGknBaiRydt6QEPrPwX6mB459BFMOZHINddfN3j4cKU+ho6DE0ChylBqR+ZNn/7yc8+yhUx6Ba1fQ9fK2NiTQtrlqx20q3igGCW0Y1TMoMFRz16eAUMcXgBnRniKDiEG1gJYsyG8CSXCHGjkkJTINosjIw5gl+g5T0NFBlEsUIJSPqJGmWWFVN5vQOGQZEAgma8JfH0eKkLJz667fiDioKEPBCiX7RhBRQPVwTDehDqSonm6DIHdaCFR8vk5pia1S0fpTEPTZNKhSbCCWDqT6iVRJOLEuwh/Nk7UkIeHWxE7ZAWR4OrZ5PBWVgCeD0pNg2Cnqkte7i7iEAIi6NlYJv9o4hIbTWCBguEm1yVll+1Lkriq8LiLGbNfk8Sa8RaSVumKgQc46gP3NJQUtORUWROq+SN4LoJKfLRybAHTWqJziCSHCelq6RjUqqElWWQh0lEM4l2e7PmMldZoWAiGmRCg634Sp/g2COhpTGTRZST+tgeGBj9sC0q+x4yRqhaDrha5UXXxnZriHFhgj4IujW0ZbbWC0daRAeqfUkKtEK9DxNMLi+aPDDLIoE6gKCXjNhmEElD7DnxLNFSRBn1jhcKoHDiyIlidIf2l3nk73mA4puOgz6TgXqnUYQ49ViCnEAnh1ZJbj7E4NrQqilHqUR9czkNUnIs++EISlnKScGYkiZ5acbY6ieacuupBPxM6mNIKMxi9eQLY1FAoEAwxW0cAOujRt3PABd2Y0xUHRu8OO9Bfi54zoXwk1stIdyqrIILXXfxjwF0zyODQQa9WZJcGLeclI2GLTnQ5T9HSoTRBYZQPATqPctnlYoJQSjlVEzjH1S7DtXu0Q4fxQ9avRHEQx+oYZQ8X1PzgM014Zs4MaoWvgx5lNOoxSSUxZ2pRHXBcAkKqhL0OxAiFfBS7spRBolpC7VSkOxlSzhcW5SJjjN9KcFQ7DnPKqrsgnmDh4/kEJS537UgGPZzu97wz6UhlVRcdA2GJ7VoppgfNNoMMMkgJriAloGBkhEyhkfiFjRSmCF1XdgEzMmK4YxeQXZ05ZoAI+JOrf9qstDlHw0PUwURxEEKkacH6h0R9SV5AQt9ZwHBIBS9lPJ6HErEyxOvNocCRoI2jBd6RqUpYifooRS56TkPUKksZPdyitnZxw67ccUZFEzhED9/wqgfHsMeryJhwaeBw+lIdYQcihcVFo8aMblZaAm1yZwmunnrHeF2QWQ8eZhz2mSaD+oWtnmlxApxjYG/AEgKU61DIQTB2tBu7yAcRWk3mxyLQtXAg0qS0dOTYsWYolC43UMdTj4OHYYYhkwcxw8aN/eYM6wvWGknuokS55unyvIYGmtZS6U6xZpP2pkEgduXloJLGWRjqbz84UjKO+ZUjW0dt4/gGPesnmvMSSEUFulfsZElromwksrVTV7gR+Axa3EAdNbnJZUS5Iigl8V1XmDDY0YXSRR+/eoNAeu6FWW56V9PiEoTCpsVFgWBQE7hkduoa/a0V6lS5oQEnqKOpvM8lCEy2MY7b8NDrBQHkC3NEDmPeo8cvDt01kVQAecJBLRsliYrowpEjZL1AjIKtBnZdHqi77M1oetkVuHZTByqqW88GUG4+RgOY+QSAbL6UUpgik4aDbwzjGcEqLCm9YwyFQnTAHMmibWwlkwoSdzP1OOgr7eFHYkVw592SH17DO85HczuiDAzcsWvXE0895exvnzd0xInFrVpRrEGn9NvrGhhKO8ZELJFOiuGCQ4afCNlOOv20bn16IyCSzNSJuk5RRwg8HZFoT2s0Saa3+HVZ6JVZhUCTIcN5oTH9UNVygdTK8HAgWFgkOpX868dC0fCa1Iee14mS9TnaADD7Hw+GUATkm7VoIatCMxRCRbLF0jgpT4Go0dSnidBpI0acdvbZYKkKSN2RTevWz509C0WYfVRpQoC1SNag8G0labvQHXki6Zf0qLWJQql5aIQX6LawRUCxQsEf/OjHP7zqyv6DBvXs22fA4CGnnXrqtm3bN6xbd6gk8ocorXf//reNHj3kxOE9+/XpN2DgCSed1K5t6wULFthhrA4Jh0xvhxDeQaLsZfhJXBrZ8UDocTw+SSwHM6PzQoMNrFPaqtV1N9yw4MsvDx48qA+bgLSorHJgEQpde8MNNeHwxs2bUEYH8O8cF0reOwygeZU+ZI9G6PEjRpQ2b6EktAJ5+QWDBw2aPXtW1YEqEHiDkmGaRCAzWNbgYUNbtWuvmwMQG5LEQS9v3Z5Ib/FLZVIRIhW4NRLbPT5KfykDZ8V0HbCkVcszzjl7+DdO+cbppyPidO3WPTc/b+OGDSQ4C2/zd9bTYl07UFtsD7RmBwPnXXTR6d86V6SghEwoNGDI4PLVq7Zs2ZLiRNcQoHe0dexw2913hxrlQCoeKfQSgJZt27QsbQGPhG1SnCOPTIhr8XKP9ozkBogwIujWLyjhT1wkhwTsonzUz3/4KCXOAN4mYGdVUWjijWoq4isnJS1bjrr77ubt2g4cMGjGzBnVBw+ijquKtIdEB0Kha35+Y9+hgwcOHlK2pmzbli1EIHQG5eGCatqRAAIPP3FESYsW/F5Z2sehvIKCQYMHz5k9u+rAAdKPkBrgTiQBcbOsQUOHeONg2mMNQmAk8wUjqyZo1QTonY8oQaoXmF2UvglzrEDCoWC1uo4WXSEnANQFbt+96KL7xo3/5ne/O+ykE3v26z9w2PGnnHPOlTfc8Mv7H8jKzQEf9EhVOIRAoClt0eKc886HhPQdKTaSJAyMSy/7ifT6sEAU8sPLLscsB/FoByEDJiDxggOHD+/Rq3fKpyNHOpJan8KEMcbMvEA4YKtZmVWkUHZNGi90FZ1xAbYIRwLFLZpjkZ7ftBCnuyVtW91x1105BQX6dozmLxm4EAXBG2/oM3gA0TTKuv6mm7HMZ6+T40cupAtQBv4gcFHzFua1QlOT8TRmAvRmFUxsKsdI7M107qayApuCIALfef/ve/f8+qHHfv/sI08/Nfree3v06yvC1Rq01uOnw71AYeee3e/4xd3jn/ztky++cN+4cRdfepmVne2WzQTq0APmVq8+fc88/3x6I0eA3g1GNVQKNm/f/oL/9z3IDCUGI0EkVbeBIc1AwP4DjuMsDEKqoxczyb4VaFJa0q5De9k79IgEI3mNCzp17xbjKYavHDdgAGK32vEHd+hIhYwHc1QkAHrKnaUrhjwd+LxImJbKzEzzBI2Q6UwsyCGdlBL4amWgpHVLBL4mJSXs4BAr2Lx1m5FjxzZq3FgtVZ22kCEbBINXXn9938GDEQ65StDKzrrmlpt7Hdef+xW9DyvyH3KQjNIXE/QSaQf0pBBtKBTKtcKCwqbIk1qdy6X06WLhB9MQFF0NpGoGxQJqzMkZe88vsLxq0aZ1dl5uTkHj9l263njHqNPPPguhkGnrB9IiXO+0s8667a6xHbt1zW/aJJDdqKR165PPOusX9/2qUX6etqIXpMqg1a1HT4Q8XsgQsNUJeujUvaupmkOM1m3bkIkNROcoK9C2fbv61WdaaNu2bayfGLACrdu1Fb2lGEqOHNS7wN6QirzAfFZBSpDRepNdjQR+CEpiFAwiCI4cPaagCAsiNeol06p9h5Gj78wpyJf2hBXCYgQrwRuuGzhsiFz0ESAUhrKyrr355h59+hxGB0sKLXAU3AusCkeNvaugsJBDn7p7nkB7Xrg0L0gcB7FGIhtQkwDNMNYF37uwffeuNEjkddP4p3zwez/+cbsOHfQaTWoBvq0KNA0gFjUnJTa/1a5T5wt/fCm9eUMWdE6Lpe3afe/7P/AaEhyICf0TYYuWLfEZr5OlpS1ULg5MCRXn+kNODl16Q4b6RikY4oWhdDAvL4+p0kB9SYilcU6jXLXjh9x8JVt8/5M+HVlgF3YJTHLysogyOI7p01yMAI5WhUDpF3yknB5vVWUgsG1Z2dPiUbWFDFZyjiuhHIU0euWoP2QwMEAGRkjNSulhusbFxc4RNbKINhBp3b7D7WPGZPHKAOUYOFYw6+rrrz9u2DByfx6qGhwKG/38ttu69XZCIXUivjwNCNKqysZABbgoRN0cCotb0dWA/KZNpbPRowZ0AamfaRIpPI4Q/gC7gsJmp55zDmqZbSLP7QQu/MHFkBLCmUjcvBdaetpagYsuuTg2CHI5/q3AiDNOa9q0KbIJIF90j4dQiL6ZlMHXBBRTGGqfwbtwUfLSVHxVc3AR6/BUC/i064xqedoUQfCOMWMbNysyL0eglpzcUSikVWHb2+8c3Sg/n66eB0NXX3/twGHHY9T4C4Y42Sjnxttu6d6zp167HC7o7qOnksc21koGIvQoa0nLVqPvuptXhTTz+EKbSXgmRqIwIYwoCPEu2HXu2sXxGTKIS9Qu3btpmXStBPDSiEW1OoDOnTujOd2Q66y+Y8eOKudAOGgcPHhQ5fxQVbVf5eLAlFA4yzwjKV1AOfFspoHmYnqYDlx9rzVIzjjPn9cLaqe9+oDbAuJp/HMRSiCshUP8NntteVOrlJHTIAYXERkTEGdM1457yNunBeJHktxwywREtYMzWquoeXO6P1BailboB3K5dTmsQQJYVrvOHW+9886sxo0vv+ZqXgny6tMPtJ6QUHj77d369KIl8KE1idNr+pTuIIfOSt7bQQXWLFSAfhXxqpCvFapQaMY76njsKhiIy9bXMBquOIq5qFlRUYJhGszOblKYZIGWCnS7hYWFOENLYJ+SkhKVi4Pt2+gRAX9EAls2bZasq6cZZGVlqdwxBNcwwK5pd+RduyoXiwRjqb7gNE0BAhg4cGBhcRGXcPwyZFO7PCYx8rGDUPjA+IeGnTgizM/7JIDUDTbKPvXUU5GJ118vUqdMC3qW0BpOIj+vCs1QqCvGQwLJE8VBF9AMzxtq1weQJnYdkVSyxKDvV8dpjvjSYwR0KURKXBC1Lpg3H3mhEMkc1wHsSR+8L+vv1OUkb3NSutCWbiDoGT3GBrVCOKy+8SoAw7rz1IivvfptxwuxALUCi/uOCil0tnphSFcGo05iY0kCEjrk7Yu8Cy9eH109JC60II2B01AQB3H0o0mT3v7bm5aNyEalzhCLchKXZmHo8lFe4yZo2tU7HimE6BkVrb4Ci+fPe/n5F2hPi+UjurQlSQRQ+VpDLBH9NADJ6VkP1Sl/yImZHVTXCiUUUrgA4qgeFaQll2YEbiFMiD20+Uk+KZF9P7ja8G0yRei6cfVNwiSSH+KuW7PmzxMnHthbYanftIfqoCQ7XHXgv2//86v5XyrSIxB8wnW4UBfDHfmAG5sdRN7VX+3zBB5U8sVelEtdycjxhoDIo0KebX/w3/coFNK5tvuSt0sMCgL0hE00rAl0B9U6gC4cRubPnvX73z0dCYdjrvfHhx0Ihq1ATTBYLcmykML1sTVTDWJyjDV8oEK/c61w1Ni78hs39kwoacDv94sD9rypM16m33GPGYto8qQzz7rk8kuhQ2jZ1SbdILEDY2+5ZX9FhT4kxqi1dHmFhQ89+ZswTK8KYoAW//rKa59PnhyKrzUWgH5gvnO3LpR1Jory8vKDBw7wFKEUSlvsJ4OQqGVqCvReoBJag72vuu6aQcNPciSKggoigb+//vqnkz4MNeRgiwcorVe/fjfceYczg8YA4pWvXPHYAw/WWrbUvaKO/uNCgsiFMKEsG2sOVMHST54fxOB0HjIluZTxg3SrzeEs8gqI0r3vgQ5PMTC8UTjTYoceIDvj+z++lE6APFe+ksPgiQ3S3GnTXn3xBQqCJGZU2njaRmw959vfPv/ii52eO8AeeNdxawKhnBfaXkjL3kOIR9s2bXz8oYcqK/bqS71k0liLo4PQJN1BOmGEyYSXR8ngb6o4sEJuhgmcLym8TTunAApEkNAnIA2iZKS6esWSxSsWL12xZMmKJbSt3r8/RD97o8gycOHrcycdLuR1M40Eh0w4ZMlHk4lUmJNwvM7BrPPxh5PfePUVOqEx/JbOgCmWEPRYi578ekBn9AF7+hefv/LC8xwEUwKFyKDEJsu2gjWckKEUrI+tmfhbTGkB9KWtWt8x9q68JvQ8eS1iTnI9mExDrF/8+1fjE3NXH1IxdmJIW2o9H9/AiUHfGGFWcCPJ0P08ejCLGcoUGQfmQdVBqDpmsk8OrQdUl5qJNBP3YYDkiOcE4Jg6U5cR6xei/6SIaiy2R7XwcoBrkQ5MPZBZ+W4E8mLZGFs75SwJfeNIH8LakC7GIalnA7W0dFFP9096qvsLGg0u8IcMI7Uj4MYQCqd+8tnrL75ohdW1QjoCMR1isJXe+QwW7hjVioRnfv75ay+9BE0oKVk6dFbL6YJWl0Y8yvqD9CNViO2K27YZeTeFQjm7FfMlgLmoSq87SVgnMm5t4TRY6wioZfZ1vqTK8gV7cpSbGE0SIqs806STIO2GiEfcKmlx02LAVySvU1KYvlI7xBNVK1AkYb1FBUNSl71jDQdu5q4vQONqlKzFtXRGaAApJCIPNKUWCQoE6KFrC6cTVIIRJEwAPjeJDihuKgqUaEpASgCzMDHAGvPvjClTXn/5JX3bJAH4S7AKaIUjYWDqR5/+YeJEhFQRVLee+EnbIx8wTdgKNG/dZvRdd8uqUB2IDzOk1HPnXUYF9yNHu7ZzowuAF7pk037phcw2GqB0ukn88M8EtLbkq7ywRxAZZ2CLM3KWAV9Eu+KUtUYCac1D0qoIhgTnqKbr3GqXJQS50BMtP/Km5BTUevrRMOXRvSYF8gsWEexEeywnJS0bErUfK4D3m7xeUJecRiUjxHSZH9GAV1DVYRsJ1hHLam4igwk1qwWDsGx1JCKpqrrmoB2oCbP8JCsouG8sHDUfa18mIkheF2LrKgS8MmiQx9oUCic+90LErnG1ApheLQ8bCqjtSOCzDz544w+vQgtB2JrblS1gCuBClMuhg9kPgvTUqxlTA6iAo8WtW99xF60Kw7EdinFrD5LfJ4GmEECwpfskp51xyZWXo0WvzmipEQmMue3W/bv3hOKqND3QfZLf/saUzQRapPskH3+U+IK99B9uWFhE2Lt377YtWzDH84gi76SjTiZFODzp/Khb1+5t2rUtaV7askXr5s2bt2jdKhC20cq+ffu279i6cvmK5cuXl61YAXoxmHQGo+uq664ZeGKc+yQBm+6TfDgpqSbNsaShTB4MosvdenRv3rxli5YtW7RoUdKieX7TppV7dlbu3V9ZsbtsVfny5UtXLFt+YF8lyWbZYlfEi17H9b/hjpF0uZp6GcMcO7W7TyJKxhYfqsSyuvXo0aoN660VSYhMVVXV1q1bd+7YvW3r5lWryhYumB+uriZaZ/7gilw/GVzKqbHtUHa2FQoVFBSEQiE0tL+yMhIOh1gqTQZvx+JIAjSmy/4DBnTo1Ll9hw4lpUVNGhfm5GYfrKqpqKjYvbti3bo1K5dBhYsP7NuP1qSyLKwgJ7VuXLw2m9B5szARpMPSeXrRSSQrr+DOX97duk077KaojWDEvv+uX2zbsIHvK8JHWE7uOx9PBFBD0LPP/dYFP7gkhXsK9Y94dveWowTT+Y4Nmx781X0R8hwFHQd875Okd7/45NPPvPiKyxLFwVtuObAner+4jqhrHOSvi6LDrdq1/fkttzZrUcqFgZr9B15+8fmFc+ZCZYlF9dW++AS2x5844tzvnN+8VSuKDQSHGWqpElZ+JFKzv+rjSZM/mvzh7p27stn1sbhIdL84tTjoO4oQYcGzTYf2Z37zW8NGnEjstBmjUqEE9lL3QufNmvHxB5NWLF9G9474cO/+/a8fRXFQKpgAj7rcLwZzLPeKS0tO+sbJJ59yWkGzQkeqWCjZgnZ11VdfLpw/d/bUz77Ioq9YUkD0Ki0p0C6U1aNP76uvvS63SQG/cDJQsWv3s08/ta6sDK6uyRgWFhRnfvPsU047Iycv3wqyw6MO/Imlij2LtJYumD950geLv/wyErazkp1gitUk+mjzSbtJajJAGcrJuWX0nR27dkusB8gKVakdWuwHKnfufvihX+/eug1+hXBBxeLicSAH0YpoT+Igdmuh/xShW6wFdFcQB7ev3zjugfvDVfTeVg3phW8cTOk9rMpyVqB9p879Bg5wimOAWvj78L/v1VT5vyC3FsjOzT3z3G+ZsplAi1/NW7CmrCy+95DMWKDdfd+vEFLZ8DTFh7JDQ44/YevmzRvWr0vseapho33xwlNOP+2an994/De+UdCkCVQDCoo+sfSkdBIdf0EsQ7r06HHmN88pLipcsXxFVXU1ag0cPKh1+w4mcwEXRBYtWFC+KkHXFMw4SC0Gg7379bv0yp9c8IOL23Zoj6ap1yCRpCA5LicGkVZt2w4/+RtDBg0qKyvftXs3yktbtkQM5R5Fqwmwv3vnjqmffprKoDVBK6xgcMDQIT+89EcXXXpZt169GuXl8iTHWiIF0lYlbHhrhbJatml13ODBJ5108rbtWzdu3KQOOm7J2eRAX3r17Xvj7SOz8wvonhnqBa2c/PyTThyxZNGi7du3Bzk24VwZC8YevXvdMXpMz+P6Z+U04tdf0LqYAhdLZQURESG4SE1XWEpbkLq6d+/25ZcLD1bTVznjiaVl1pFUSoiT7CeEuN+tI+/o1L1HmsGCyHPycocMGTp3zpz9+/dLbepFfKhjNLaxtbp279azbz/utRxoANSFuRgkEoCX/ObRR/fvrXRxkl74vIeVzg5TgPY2yYAd7HF4oeRICDHfFVf/1GqUIyUOaBhc8sMfY6qP1xEalLzuIPfhtQMA4pLWre598MELL720aWmpaoABPbpUaZYQGfhYweGnnXbfuHGDhx9PX3uSgVQHaLsAkA3rrCuvufb6O0Z26dOHhy61DwpZFIDAt7MgI0or2LJD51H3/eqSK67IylUvmxH5pHqtgXEOYJ5olJt79XXX//Smm7r1w1gi9XDTxBz/nPwb4o4Em7Vocc2tt9w6ZkyLdm3pUVsUJVt5mcBUdPlPfxrIyiar0gSFJRGxDeRkX/HTq/dXHdizZ09lZeWBcPU3Lzjv5lGjcouaoveId3Thj59npmjF1y35nrDTNPsAOYkVRL9uvnMU4hSITFWLBiSvTaYLTSOaEA80AZ5gftPIkR179EjfKHx3OxCUH4ErbF7C7qdkAGdTYA3l/7HwlqQKKB6rUoYqYUhPXZ2tNTasXv3wgw9W7NyFUwdXQwmQhicBqfM9NEgsDwzWqk1reUuYmy4SzClsMnDwEFhBlSQA/3YoRnLXnj3H/uKXdH5NLpXEE7Wnxg71YF5hkyuvv/7Ciy+h6Fof+hQnzm3c+M577hk04gTprHwtDhmcxaUSbkk2UNEl4NNH331PQWEz7Ru1jtYywikoBIOlrVrede99A4cPlwDNqmCa1JhLj1CxW59e9zzw4IhTTsFKnL91lqoOe/ft26SoWLcmteiiQCBY3LpNjz59wlYgpyD/hptuOv97F1K45LkP/FUvnFZkV0NZmaIjide2Y6drf34jzGFKpZkAKNdAIbZSmDQQgCedDo+8rUuPnrAUGStlaCVTI1ZAfgSusKRYxz6eEJKg7nGKHjVzJgjpOGCyrUsTrEC7bMXyxx6ecNC5XKvVnhTpxUHhi/941Qx7q+eq6glgFcONe5mkn6jQmt8n6lKv1EUn2rZr5/Un4SmuBs1Ku1hqDTv55FvGjmlU0BgVU7GXdj7DC6keRgs4nPWtc4edOAKNyaFaQy7nl7ZpPfbeezt278ohhvhrA0nr6AOVSlF8iGZadejwk5/9LJU+xofNY1ypb8CQwXff/38lfrYwoRXlgjBxhKel64+uvvrc730vr0kTlMNeelDFA8YfvVkWHWRCk55DYaRHn75FLVvcPnrs0OEnBoJZzhwWhHJBAA1j7YmGLBzyv1otMpIwvfsfd8U116AC7QvEmRjExIHsgowWmUZoo/cFIjAaJZDfys7GSrBTj95UHkdRLiiZwN/ROtoUtoWlxVgVNjFCYSrw6Fm34AKVc2AKRMIqIydVIYsuSSDD13npkIueCh1pY2Cqw4GWhyoG7I2rVz/16GPVVQeox1TDX0vSqOtY0qGRDiCXliwF72xQQLWQwff9N7COSNakWSF/xsAjNn2n8v99/6LLfnZ1IMgvN1flUWg/0xlfGAFRpTqCfDBodevVa8w9vyhq2RzeFc8rXfDKaXRBpTpC1Ah19R80EOfCoZxcX9UlQFxlQotW8Btnnn7xj3/YqIDePKpjihx3AQQQpqAJznMd/ceaGJGuTcf2t985GotNelqZjiuAp0AoXSLxgZhG6XDQGjbixB59euta6QLtqhyDhMjOuulWWgnaiB/ai9yOmhyQHwLj37aCCIX8cx8qFDohqU4Ak+1btyxfsnTVkmUrFy9GWr10KX2Va9Ei2l26ZPniRdgi8de6iAAJ+ZX0XS9ksLt02ZIl+yv3Ko7xgY6Ihjl6Bras3/jko4/X8JdlBWnpJ43fq4P6OnTu0nfgcbHFCuTklvXhe/o+CZnPl9IF6gZ9yB5Blxj3SSTFAC0muE8iOujYpUsf+hmQmLriu/jfuG7d/Nmzpbo4PWcVSI/0JGDglLPOPO+ii2gOiyXQ0IPBNSo0UOp/wA9MKfdJVieeptDHJsVFOFXPys/lZaBPK3B9l9wyGNROVDZ3VQoffgxRkvQ+CQ01XukUN29+86hRoUY5abikAtYFAG3wb4rBwYjcrVXbtphsVy5fTs91qYMKNESgEdoQNdCnf/9OXbFehpUhOJZcRKSOWcG2bdsVFRXTE43OfQPxB2LDwwkZ2vIBUSf+pZAVRT5LOwxUyrKsubPn0A6tJvmIPhwL4qOyDlDBEQPMQ9nZ1996a4++/cBIUfNBtE5nAyQy7YOSi0kUPv1kG/AZAwvKYioSArqXV5A3aNDgWbNnHeTfw0wAUkHA6sL3SUgMBeRoB1KIj6GVj//34R8nTpzx2efTv/hixpQp2E7/XOVnYPvFF9M++3zaZ5/NpF0cJQIUEhknkE394otevfuUNi8V+VUb6sMHOAPaum7dY+PHH6isJKsayQUx5KBhdJ/E6AUo9RMVRyRIOG9vGgbi0wLt+vCdwqLiCy++hCxiEHiBY5TgcjSAjUQlDQLIhrP1y668KpjbSFTli6gz0bugIE+YTklM2djH6xfUAD6ysm64+cZG+XkJWojK5lIdhQ911AX0iD/o86zzzj9u8GArRI/78cEoYESxowscFjhYOBDTU3scfVALR+n0G5R2GGV0R4GOIyFA0bfrKMX6AwzAAVoQHDh4aFZuDrGKJUsRWnKw/fa3v92TfkuEJYwFvRfM4S8eEIzYy5YuJsmZgSEAjsc4CUfKYFHz0iuuutJXUakDTUQ52DVBOxKKUAraNrZZcAS0zXlJWfSrUdiNllCyA3TRgciIDds/CchMdmB9ednD4x46sJeCYC0gVqtd3TiIUaZb7wJon0aIAa+BpUQMCTC9t17KiG9jr/lhUTQD38EhZBBofnTZ5cFG2bLa8gVkZ/Htg3v3fjV79of/+vefX574zMOP/u3VP3z0zrtL5s2LVFWZmnHo6wRRx+ChQ3oP6A/ZhL0UuoE+RsIBO7xq8eIpkyf/840///6xx1977vn3//HPOVOm7Ny8Wep5RfK3nx98hjpd3rIuufzylvTCcGLjlc3Rg31gz56Fs2e/++abb7z0MvT28lNPv/na65/87387t2yWX8cBmRFiBFTOwSrw459c0RILQzJZ9J2JZFm+u+UBSm22rYplfNOZrmbi7JgSfesWcbgmvG8fpHrvn//868RXXnn6mdeef/7vr7323ltvrVi4kNxTeyfAD13SSpM7pMZVTqOBgweBPxFSSy7508B777y7YtFiyCQ+6YI0KkAQnP7pp09OePiNl1/FWlF1MI4d2SqRnVu3vTbxVSmpBaKtm+tov75CEjPjHXqY+mhmZlj049hMxqHAz46s1IC1fcOG3z7ySNV+ujGimxC4dhOjHs+LURj54L/vHTxYTSzgAH5bNMTP6vgfjdkGrOzcHJwXkzXVMIhpF4WpnRerBx61pwqQ27Rh/bxZs1zVUY66sAMGx6Bhx5/znfOxCFDHPBC+G9eU/+vvb73y0oszpk1btnjJurLy7Vu3rlldtnjRounTp0+eNLli584WLZsXNC4QAdwuEAsWMcl5MThk5+beeNttOfkFGBtcRbGVvAC+cmBvxUcfTJr4wvMfffjhV/MXrF65ctuWLRvXrl+6ZMncOXMmT/qwfNXK3Ea5LVu3StFvQJT4vJhCVNAaduKI8y+6CKYTqUzZsOWMvX512Z9e+cNrr06cPWPWymVL15eT3jZv2Fi2evXCLxd+NHnywgXzS4tLS1uUYjjHmk/xQ0koO9SiRfP5c+aE7RrTvgIabxzsevfr16lbN/ElOpGMISRuNKzsSFbIOlCx9x9/e/O1VybOnDZt1bJla8vLN23YsK58TXlZ2fKlS6dNnTpn5ow2rdsWlxRrx+AFo+KIDOWsSMWO3YsWfEkUbqHSANQXjtgzZ87s0bMXNOEyEcUC1jD+oaCZU6e+9vLEIL92c+eOnccNYs+XKohOGFdGdVTZtW3r4xPG79m5E8WJZWR1u8+Lwdqcn5hJZOmiRauWrUCeZypWtQMSlcMfMk5x9Kgwwj7EPH7ESSUt+DfUosfdQH+3bFj/6LhxVZX7JD54aaVF3Zi07fs77vUWBwFxhq7du/fs3atrr97devfs0bN39949db5rn57delGJq9yVR32i6d2nW69eXbr34MZcshAgZ9I42KFzZ4mDriAIYGfDurX6+iDADsUZsaJl3TjyttyCxsLKC4wbjLO3//yXV158ccOaNVhz0fkIHwJPnbGrq8tXr/po0oeNsrK6dO8eq2pFZoJLvHEQEjnysWznXvCdPoMGoUBzcHOLRMqXLJ3wwAOLFyyo2rdPZJMkbLFFIcLizOnTVy5dOmTwkFB2Nh9xw+SMTOI4CCmz8nJvo8uCjXjMkOQQUzjw1rYPHnxj4itvvP6HrRs3yoN8sCa2omrQIB+ihnZOnzZlw7p1g4cONUMhcxN+yAVLSktXLl+OkR8Oh1EqmpIRSCOByfr079+Rrw9SS1zOxQSad/GBs7lgYGNZ2SMPjYPyIzWIqiQGloi0oObhhBIMrMo9FVOnTOnYvmOL1i1pvRXlFAWJF7GnfPap38F0wP2EDLMQCnv0KCopJYYoZGtCHdQX5COB2VOmvPbSixZfKkVat7a8omJPP1kEEBnf6CZ70C6E3rNt22Pjx+3ZsRM9wpHEYB16rw8qSKxh1pElCxeuWrFSTCmFgEhLD587RqEyFDKc6pAcC15af5ww4sQEcRD2hStsKit7bPx4BEG+zuNLSDAfMqVeeOIgWgdFvcZBDoLde/VA/Oreq2f3Xr0Q2sw8tr7lrrza9urZpVtXPeX6BbLkcbBT1y59jutPV3U8MmPfvE8CoISImBDVIcBp53zLa3UBFUciLz3z9NRPP+MvHKhhDLXqSzb4QKIlPi35rcVLFu/ds6cv37eR7vjy5kJvHJQOqRo4Yb/qmmty8vOl1AVq147Mnjb1mSd/G6mulvdAUaGTFA0nObRzx4758+cNHjKkkfMQtQmpIkA+XhwkZ4abWoGzvnlu70HHOf2LkRwf1fv3Izov/eqrIL0knE6oJMlRoRapQBAMBLEcW79+3eBhwyjoMIRYA+0UFzb98ssFNTgX0cNLHRSGVu9+feg7GIq9ElWB4wLSto2bHn7o11V7K3Oysshq6jDGHehJTpxU44MuEQYCcxfMO+Ubp2JVLkQmxLiNC/Lf/89/vFqqBdCcHbZnzJzZs0f34hL+eqgAzVCIsWkl+NKLiDSiN5qhA1ZZeRn8rd9xPGBVb6gCquzevg0rwd3bd6QSBAHRYbw4CIjCJQ6uduIglRtbkUHr1ZOhGhTSKQ6OQByMO/RsBKi1T0yg5wTp/nksNFsviNQbB3kCZiVg7HrY1QHCFiFbJV2SdqKHGAQ0V6hsuoivFxegdw5OfBvOsoaPOFEd8If9lz+8On/mLHgSXVxiQGgdBFEkpaRdfqAvZAc+++iTd//5L7iprCJwIOVeiU6IJf579OrZpLjIty7xtSPly5e88sJzoWReDtmU6LaNye/JRx/FlMyjSBULEsupPU+4hRpln/HNs2lXSpXkBKazn3/qqc3r19MAprWLG1FqEoLeagXKebPmvPPmP2RdBl815WHXDXbt2Qtr/6ysLAgTd2wTL5VlWdQOSRIJHNxX+bsnHg8fOBiiBQo9/YotZ0giYkvdjEqHJe0H773rUpSAo1MglNOoVZs2PodrBQz4SFXVU48/vmrZUjYQ+yoHQawE//Dii9xr0hW1zf4WDEc+n/zx3157LXrljYMgVoKPjx+/a9t2eisEFwPcu1pC1yUH4O/eAI6msEt36AzNJ4LUikdMvQtHdm7Y+OTDjyAIyrhzSU4Okg6kutZDDOLxSkVZqCkJEJVIXpenlRoUvt2hwQJkZw09frgzUtxA8fLFSxDUYBh/DfqBbGzb//3XvzaWr03eNxrLPkRQKcXoE08S2/lMYHak5sD+l557gV+aQF6oyv2gzxrwgYG0ce26d998U0pSnxpNb4HmBg8Zmt+0SZzK9ozPpyz+apHoLRV3AkAJvb3/7js7Nm9VRbHi0fCzAgMGDYFmTGHiuTGgjyiaSPjjDz/YvnkzLTbYAcy6LjmxyyJFpn4xJbGSSkuNtVudgTAXrqr63WOPla9YxVMpBbX5s+a88tJLmPAgsaJjQH75ts1nH338jzfe4FBoB21aCT42gYIgDsmcLT01+xsPSe2VlCBFoF9eUBCM0Pv3Hxk/bn8FvX+/vpoD1DBwacG3gaSawmEXheJulINvrWQnx1NZA/WoCEAUDWA6Gjh4UCjP9a1kBTSJtcPE556DJdwyGROfr8QoscLhl599NlKT8G0ULsbR+ZHKEaOHHD9M9Ig1AX044B37b3/+y87t25kF4lzIlEoQ7SkvnaQxbDGc3n/n3bUrV+OAi7OJeGqXoNu/f3/eE65RyDJz0gfv++gtDhzZbBrS4fCfX39NlkLSkIBWRThXDWX37tsnO4dMhkWcd6UQc52IPBnxTvGgaGHbUz7/Aot0eoKHamEBSG0KhExDD4R9e/du36J+GFbLA+gYnZ+fTwLWHY4F0QesQ7FsL1+5AqfKX86c+fIzz2DCs5x75Q6h6jvoYdOPPvjwH3/5M3Syb+dOWQnqIOhQmhqNC1cEkDqump4o4dgwOYhS3NKEZohD2zdsgPwSBKUE8LSYHsTPlYjmKxvjwesQxy6s44ePgFa8CiadRwKffDh5767d2mYpagZkABS9eePG6VOngU8K1WxXCMPeoMFDQ7n+MRqo2Lbjs48/EnNCwgRe4hWbemTbb//jTRKUOhq3bjxgSPQ7rn+8QFe+ctXatWuQMYcQEmKPqyQ2qe/JLFr4VeWeCjguBjsXxKCwsLB58+ZCafZaRKESXuvxnoLe3bt3745t2yTySUlSiPU3b9yUoEJuLuJgPQPdqTlw4MlHHn//7X+/8PtnYC/XSlCgOwI5EQonvf/BW6+/8aizEgSTBI4RD+ZcEg+uX3ytBVix1JBomExC19fszevXPTzuoX1wAJnk0hY/EZJ3zEQtdOcC6tej/HWUxz0qnLkU5d16dPdlTQSWPWv6NHEmQZQPjBPfPiDTlLOnz6ABTldO/ICwQJGBLot60ZluH6m8hopZkcDMGTOyHIdVPfJIxfvogVtUkQbnrVUVlbTLzXijobeiRpt2bbMK8uME+ODSxcsgTdh447QkdBVbszxOPrDFWX+hg06X6fQQIlnBYJ9+fdWlvJDztLOSlD/4aW0f2NaObdvxKTWNQYEMEqST6BoD0RUCqBzVdQC9lM6DKuoFRk8AtIVQ+O4/3zac0GyfoK/TiZwIhZ9MmoQTf9NvDaDMrzgWrhhHtwc9NWucVXbtQP1UynM+UGRFNpaVYSV4YG89nw5rqC64fL0hWmoIJBiQdQFOr3IK8r3jH4C+Nm3cuH79elFc7RSFuosWflm1txL1VVE8wGk9Y7eoqAhbVymdHlJZeCbHaJSkqxxNH0IwnT5VD349qpMCHty6bRs18khCtwCDhw65484xI0ePuX3snSPHjL19zJ23I++kO5CkZMydyING50eOHoU8KrZs3RbcfUXCyrljx45ZWVmYPFx2UV2LrxCEV9AIVFFCOPwjeyp20S7veJGbS9+qrlNgiAO4kCQvRDZTA+iUppcqKXbTBdd60HeA1BfE6ykIRgIrFy99ZNwEDoJcmHTUpA/VMZdj1U5N6QL+oVPt0BAagTASaHwHG7x6xdJl2h20osRg8aA6KEsargXJV69YSXk+wvDRBBqi0ihrImhWDPGiHqndESGz+kDV+rVrcAz8CR6ppA26Zu4RF+TYUt1IZBXLxrdZ0kOrVq2wIpM8n71GOWCntFXrrr17U+rVu1OvXp17946b+hCN3u3Spw+2KMlvXADt6S4jw4GGyiB/cXExdZqNwp9hG4sYOqZ6Z24FlLfsXbt2eXXlACqJapvgBHrg4P4DKhcL6XZuXh5/1h3KbkjSOwVIYggjEAJNhk7xwwlSXcHUQOqIaToeoPKUECNPFFEbUAZ7SxcseObxx8NVVdoGqoPG2Rt91A3M3KMTXzWhvcTqwzH4pEr8+EXibchIVOhHk6i9OHKmDt/qKGzWrJnaiQVRRyI7tm+tu+qxvN+5a7uc/MaHf+8KC31ekyPYsWMHf+KsKEV3VBBV6H5t37pNMr5IoPai0hKV8wO4I+HkKhyg36hVI5QdWiWn3KSBK6jyOM1qeeSHRySv3dVCVcsKZqlyH4CMnt4lqJJkSNEBUrmgli5MIXVe5MGuSzBfOVPvpguuir4LhRQ1kwz8PHXEXr5w4bO/ezJcXZNAjyJVHdtV/N2DJo76EjTGsthjb7vtpiuvRrr5yqtuvOKqW666WrYo8W69yUVz9223+08aDQPpHTaFRf5xkGHt3LY9XU9SWob+jCXHjm2uWAMqH3PHlgYxoguLYp4cNNzRduKXegrYGzuEWyxPgvRdauHQNiWbi8oN2IbMQ3FGNZPHKyAs0Hgvph1j3RotRZHZFw2TxhxvtPTTe7HdQxfy8/PlEULkcUTEoKy4LokZpQfULlETvcEsIeKsG01Eu10/EH2YWiHwm01JGOkIdcLpoGSwdfoVrQsyydQRPufF9OruFAcsyQPZRZexIqEbMJ29dvny3z/5W7umBgFRHYkP3fHagO9exkWiYz4gr7NrwqFIJJtfMtGIr87KFiXerTe5aEhHCU1WXxYVQJXy2hKcXiV4tGPr1q0pDIREAGsM0u3b6dp8umiCxaCfyaVo67bNTpZQa/3s3r07gea9bHVJDn+/ApHLZ5CkBjrVTb8uBMDasqamJhymbzcKZGzQ2ph/cJGIDMkpRtRWP1HE95OvJ6DSWowOVxTD2C9fvvzJxx+PVFcfGv2qVuqrMVd/Ghr13pwwzI7zNVvBfnq5hRs8sWFgJVkrRAdeJLh3T/KXTQrEt4Rzo0aYWQgQ1Nt51+WquuhnX0WFylHv/HsFtyHPMfqsz9nNVSonsyQRQBaP0i2GKMWOYPalnkYia9asqaqq0kMRhTaxo/csuNcpWIugEedSZgb1hbSmFmetGgPYbsWiJb977Imkb0WsR3AATFnypOOqIS6IHDLAhPJw6c6dO32v3ImNmzVr5jVeijAVyLc7UgJq6Yo7E64iC5kniNNyRy/AIb9JY7WD3djApIXxYt8+//sGqUOCnTfymiUSK0kqum1AUQ9hLVxd8++3/0XXktgJEfiUErDMdx74ID0y1C4GHbJGSQZ1hHu+SR8w3n/ffa+66qAZShraQOmFLXKshAOsjsMvXdRvc9A1M4zs2bVbFcWCjRHxv4vCaxNzfpNVkE0vAInxDCLkJ+bi3Y3xhVwXQ10M6QOV9IOEJKg6SJB806b0OwTqNLC2gGx0xzw+hwRq37mdbtTERjH4mHIzcOSk7oD5Jrp1Qie56K6mIXqUc0LUI2WwPljBkUAoZIX37fvjq6+Ur1wpz0KDwrLoyoq0q6Zn3qJMiimMZnAEwOtOsJP+uougoQOLctAUkXR0NbS4LtRltCeAc9fVD5bVtFmxytcKkBlawrZps0Ie6Wlj146dKscwg06zIrpdW3e1JLxT5A9pVFTHt4HdQNHa8jX8MxRL5ecpdHJ+p0LlVy2R369Y6pTH5FcuXQYColmE7bIv5855561/3jV69MypU2kmYvXqVQnyQZnebMw/qgRbHQQz0bB+UYv1oK+7iplc8C2sF6QRB5OPLktNvBC37kPxcAEd4LsEWjNqVQKwEYKdO3f22oNWJiqrgPqUIkEkKZFadCeMielrIcb1Kd2KF6ioWsTpXyRC4hmt6ZGMs8OWbVrn5ufrl9SnYgVeyKo8AL4wHr3xLD4SOO7u2BjtwqxpU5+YMOHJ8UjjzfTbCROQuJwzDz/823EoV3ldrmmQfuPUevY3v/n3W3/fv2dvKMKrYPqRESUhtlnOnUClQBQ5wscuWjOoHyg9pwMZDibggUhqhyFste3qHXq0+8AtHIuSuJ/qjEOdYDY4GqiV/ZWVOP9UOx70H3Bcjuf5WIl6iWFasaikuG3HzmonDjQ9MpJHf/G5a1fc7zBYweDgoUN0xdrpB3YfMuyEBB3yZSuN0kORHIk0orSRwMknjsBRnK9m2QHnFyo8v1OBFZxtZ/FNQ8lja4XDkpESInB+BCM3Kysvu1GIY7kEdIgnEio5MRWpvqhHCGXmyKwEGwJK53UDGzCGj3bpBoK/ryfoCgRK0NX6FTdBQ/UCkdYrM9b2u3btQCkvGegxDC0HMlZ21oBBA+04o0hPHjHC64tSqM7Fw0443sXAbEUQr/vx1lyywEEcRLB0zWEasas/UOE0BmFG7QuaFRd16NpF7fjB18qyCJUv6pqI0lqB5u3atuvQHq1Ki9xBNYP4dhaUwhbnGdIozrghv1YnagmEDxXSEhvkWXI9kctj4Bv+mEMG9YBaaFI8gHxRFaiSQ4n0mkvSSRzmb9UcLV4l1zK80qJk+dJlyPhe58L6YsRJ3wjzVXoB6I3goqCDhStq8Bi2ho84mfJSlCaWr1jqW5NHeLBH3/5NPXeifSOXwCOehd759jsVrFuz9kBlheHSsbAiJwwf4ZzyqNAm0HkoE5A8oMsl47oFJHlsBWbFDA4LanF9UHCIA58L6bUOV9NbH/CdUHzGJTjCEE9OlM+YMpWv47lBay4r0LVv3yHHn+CMZ1p+UHTjQagVqsckeYazDANH7Jxxztkt2rWJJFB+/OEMNksWLd63ew/y/h5nBS+/6mpnSUgNIprz/ERJr6QA890q8sg+/otLS791wXkod0Sg8lQARpAtGIhMh+r8QAyt0KlnndGydWuHaZC+PRmrZyhf2wU8TX1SeZDuBasiBumVzsSh5hqpSCvG2J5mcMiQVhyEoSQJYGtUTqN+/UG7WQZRYF2xZNFXe/gREBew5iKrWYEfXn5pXgH9VhwgIU+PXoCGsrOrMyDGUC5sXvLdi76vNV+Lq/VW2J425XNkvMYDLwz+Hn17Dx2OMI0WiURFkFgJAR2pASbmnz352TXBbNfPrrs906wokBI0Bu189smnrkuEGigNNcq98ZZbQzk5cmGBfz0oCURs3Sg6YyZ6xZZf70xwQEzeUAZ1h9c3UoEOhYcL6TlH0k7WelV8WOArLUxCz6BF7BnTpsSbnKCFvIImN40c2aixCoXYalLbssP0MgEGhiCPQhzFoMUZ622j7rQaRd+i6n+1Pu6IVrFm2ufx3wiPcGCFfnTFFV1795JQyFtQB10XAhGJOJFsQnbZ1Vd37NkzXusojieXjkEQb9OGjWtXl9FviQhjRjRnBZq1bHnltdfKhQV4VIJQKLXC/OZoLAXxQUtrfh1hm04di1u1pFcTEgfQIhrSzRIeUWDo5pnEcTM4HIDhdBL4WO6QIP1G48+6xwbIKhhZkcDUL77A6Inb26DVvmvnUWPvatysGUajKoyFRAfbwkgGW6t561Z333tfcctWYFqXYYlTVvoJt7LV4B6v4azcnFvvHD1giLpngq065Ad0uSYQuPamG4efcrJHtrQ9E6fGX3z2ia9sUAOHKeu4IUOxKswrbBoJhSBeKqjByX0w0Lt/v+tuuvmpl14ac9+v7hs3/pEnHuvdv3+KHDI4BDi6VkIahyX4HimIdyZFlrTszZs2raK7JT7POjslwZbt2o++95fdevdBKNRrZf3MIOIpvTMKC5+g1X/wkDvvuSe/WTMz0ET0sjEt8Jrns48+Fkb+Z9ZWCOusn95449nfPi9IvyMslws1sEc/9EMyWlZpq1a3jxnTb8gQkl0RAG6HJmqVTQRIN2vajAPGG60Biaay+AWTcMDuPXjQveMeGnT8CQjBJI3QRSESKiAC5jdtcvXPf379HSP7Qs5QiL4cEgzmFRVdP3Jk5549pLr33jeEoXa5o6oog4ZELeIgrMMefTihPS0lJB23GPkqdzTAV1ptRoSE1ya+HK46qPYZZtBBDqOusKT0ltGjR40Z27V3z2o+ZdNJdvsPGvjLX/3fNTffmNuYfsXNbNL/pDgKH/EE8JvPP/1s1aJFIPFlQnLS5bPgBd///v3jx5965hkiEoIOUtgKcqIIeMU1P7133DiEcuNXUtOGa0Y5eOAA/3QGZgO3bKJA0MOT8gqaXHndNQ89+ug5559XUFgoEjopWB0M5jdt2q5Tp0EnHP/dCy98YMKEgccPDdDbBImFStixIj/40Y8RzWkVn2jZm/b4TAmu+eVrD3li5KiD9atRo+6bMD4SjL6lEsuXeVNnvPzcs/AsI0zacM2Tzzj94p/8JHbVoEBXe+zImFtvPbCnQmqxX2KDbZS5KEkI5Eo5r0r8kVdY+NBvn3TN8ALwCQXsv77y2ucffxSKH85OOevMiy6/zPfOLP3S+fRprz73XBaLqkqV2NQkOCD3jdPP+MFPfmLIQIwpxrDwGNXISA4c7YPVe/furays3L9/f0FBQV7jgqby/hUOCPS2OAIJE815wE3Zf3/99U8/nOQbmaSuZQWbFDW796FfZ+flQpNxQyp3ja/FBSr3VEC2ioqK3NxciAegLhP5GNQPxMQKBMtXrnjsgQehdpnGvQYCHWLZ+RdeSLeeE4ZXVCWFg8KyqvaR6nbv3p2dnd0UKC5irTIdesFe5GVFx+3wLVf/lOVhCa0QrUqM7+pAPxf+8OJTv3kuCjUHsR0yUM7/3vnPf/72lq8jOfr2sVXYCnzrOxd8+8ILRYGaoQBsp07+5I9/eBVsfQ19FIFVYJ317W9d8INLoqv0WECz0P8T48aVLVuBLnu94rADvcCIvvr6aweeMMIUD5aqbwOZXxTj+JBwij6kkJVIFI5gZhAEtMBQDUz7yUeTl3210OgDitFJVSAZGgMU5oLBRjlNi0tat+/QpUfPFm3bNSksQiEl90W3OkHmJ/jc7p07/vqnP4K169ETINpZWhXi3B4yhPILm7Vo07Zrz15tO3YqLG2elZcP2cL88ud6B6a3f//jrdXLVsD93Jo3IKqzWcicgsZFzVt07t4D4jUpLmG9sfYoQ8E0Hpc9/AUbDT2TSZ69n80a64pmzKoX1DvDoxGu0XS0IEkcNIYXUcYGNRx0D7+kUY+iiMrSUEmwGATYd83rDdEWhYl6j0hiOJMx8TIlNkaLCZMG4mH8vfLiC9X8iheNeAObrk/R0Xi9ivY+mksfEFu8DWF66uefL10wHyUIJnJUQwvJAUCJ7xIPddKRhGjRR603iu9+BgcdZMuyIy8/++yBvZVJrEx/6A+rjrpBS4kEodMEN24vWjBf+kRx0wrSos+RyhSVtpz3QpMBSrfREn8NCYFcPEYF1r7pOwop6/YYgWjP1yuOZMQ1k8ueyupxVg7aa73fJzE9LF3INVdjLeWWlh6djTYVAyElDoYwRmggyVK7phup3Ln7sQnj92zbRit/LpKw4h2rOtwkBoiQqg/GXHkEhKFoj2Xz50ZiOFoN2YHnf//7L+fMRjWTGpIkFca386iDdLAq7iswcYav9WYa2gXoHwkr1ocf+vXm9RtozaeO+OtNSyv5pMI7sPfv2f3ev98x3cBfqjiPNEozXk9IzTcC9CM6UUT9U5kyNSbHEsKeU5OjAu7IEg/iW/Qq+ag7iasTxGurKvdVVtA7ls25NK3rBFChqcXKioqaA1WxQ0K1GGY5tm7e4lprmBwgBr0Oz7j2Jb+4ClB3LHuH368RBeliQVQK7mRkY/naX993X9mSJWhNS2MKBr/3Dm/Ab8xT6ZSPP578v/dRyeyvRHzRnu9b+1XvjIsPQM3+qud/+9R7b72NoR5zwIGvYEDUfgTiLbJtXrv26SeecFipNgVcqH8FxTQ0KvLiUBID1RCetq7fMO6+X33x8UeYJOUA9CbqEsG0eDiq76vEk9kEYqt9sPqpx36za9s2oyMK8tQhgENoL9G71AIBeILuC2WwqjQuavtCRsTObTQiWHKB+hTf2LaFfsJBimL0eOwiwdR4JMPrPwreA7Do+nVryD89PSWbRyJlq1boWnVRh1m3bNVqtKs81AAiGsRYt2aN2vcD+Kxdu1bc1AX29cCacjBPIicJQ/c9Izi/e3TC+E8+/IAYenjC72PjtYJZiBwqYpHwjzfe+OOrr6wvL8MJrr8B7Mja8jXxZBP96EHOyXrv3/965oknDu7D+TuFM90qAoqvYAIzBjGRvXjB/IcffHD54kX2QcxAaERaMAC1l5HeBKowPrLAuKbmjVdem/jssyQeq07UJYL5ipdAZjqA2TUS3rBm7bgH7l9XVuarqJgYHQisKStH7/yZRsjNEFQp67BKpWvoS3nZKkeFMWAh4Z9lxiz8tUCK6+gjDf7DUMN1uGLnrknv/If9yegtPCYSPli5/8+v/wmeIVVcXpgiZC0WnZkjgb/98Q27yv2qdxy2IvZ/3vx7ZaX7Jz7MUYvM7p07J7/7X9cAEB8tW7Js/uw5UmLCpktg0X6TMLz+kmuFb/7xj689/3zF1q2uM6KkYGJ755bNTzz464/ffz/LjsydObts2QrzhBGNiGyT3nlvr987sV29QxJdQTbEgiVfzp9w//+tWLiQXhrmROoEAQVwIhEjEvj3X/76+yeewBo82wr+/U9/0kyiiAR2btz8yaTJyKJpgRzhycFJqkBFeWRCkcjc6TN//ct7v5o9mx498FsboZoOGn5RCFXE8Wz7wIF333wL3DatWaeVACB46bzoRwD9rFy+fOEsmNvjCQF75uefbcR8yVDVjV54QRKobGDrxk1TP/5E2JqTCtxj8dz5S3AC4fAx5TnaYWrAhVTmjyMQodNGjDjt7LOc80UCVkqb1q2fO3sWm5N6JbcjxEGWLF6c0yinc/dufIuPfmAPrrlx7boXfv/MJroMJGQxHpkORImqInYqKvasWLGye7du+Y3zqTlO4P7ft//57r/+g8k2aRuLFi3Kz8nr1K2LEpirfzVv3sTnn6/x+w0EUwJV4vSFC63169Z++MEHmzduKikpblbUjHnSYUmgBrHe5YRBEtm3Z8/k9/730nPP7ty6lRoFWSDw5YIFbVq2bt6qJclG9ehq5uR333v773/DYHe9mjwxiNSy91Xsmz516tw5s3Nyctq2awsGLvE8iWRDo/NnzX7x6ae/nDsXw5Zub2MBVV5ec7CqZ98+qjr9nqxVvmL58888Xek8GgUkMDTK5Si2Qf5pxP379s+Yib/puY1y27RqGaQvMEIGP/Go3EwUaJB2bNry3r/efvm555ctXoxzghB1TjUHJL5vtnDhwubFpa3btpGZjevZ0z7+9C9//FOkJpyoZiy0hyBhfCxevKiwcdP2nTqyzGRHLAvmTZ/5h4kv29XV6DiTH93gLltdunfr2bcf9Y8LXR0jhViBzyZPhnscmX0msS1r0NAhrdq1N6Unq6X+/CBvsVZCJau0RYsBgwZ269Ztx45dSxcvWjBvXixxnSAjR/LcqoX1w7ATju/Vq1dubu7y5cvnz523e+cOGrFMkxgicMvWrQcOHtS5c+eNGzcu/mrRsiVLai2wKAI8kenWo/tZ55zdb/BQt1M42L+nYsmihfPmzJ09cxaaMxvVfLr37NmnX9/WbdqtWrl83tw5WzZuostkyX5jRKp7uyAv7ENIaNy06Zlnn3XaGaeH8gqi4klGtBsJrFqyaNHCr7747PPKigrIhjKSMBiE/llvgaKS0kFDBvfo0WPbtm1LlixbMG8uFsVYXnF9gjYWjX+HceLFFBNSrQGDBg05YVinLt2KmjdXgmELbui42nIhTj9Xrly2eMmSxV8tX7wEosllxHTMR9rilX6kU5eu/Y4b0L5DBwT6+XPnrF+71jRKukD3+QvOVtv27WVErF5dvnDB/LIVK00tHe1gZ4s+P8g9huGplK1JIKOEww/+8hdb1288MvvOvuf//GDacZA2zAMTNLzK8ciG7ba0jT5gC6mwTddx687BC80TmdIWzZs2KyxuVtK0WZNGWTkVlXv27qncsmXTxvUb0JC3RUObyNM6kKMeVhMolINAEhlBl4ACR2EomKlpYbNmxUVNGxcWlxbl5zU+ULWvYvfeXbt2rCkrD1dXJ9aGiOLojYa991lFQYpx0ARLSNpD1Xbt2jUrKilonJffuGluXqOqyirIua/yQOXePWVla7AyJQntSIhWj3TDmtWVOkhmCAVVo0XpDhDnwen04YwIfErXMSKQ4eJjAWxy68xzv/mdi3+onzmWnuo+YheGOebjoA/A10XgLalHsDGS8HfZhkH15DstslZKV0I/nlGIVAAIMMLI/VkLHBeUNyRtUTNJRTa04CuMSz+YtHnMK3olG81blIvKJrykk35AxKmd3gQuqVwgCZ1gxOGJJMSKj0+j6QhXlJLotRuKxk6txPwdEJUsYtSOUyWeMoHUOMcAVdKiP1rAqkjh+yS2ff89d2/fuPmoi4O1tJp4ISprdwTEb+oXJv+kcTkBwAeLCFQ3OcioqCOEJ5KcMJpbfShpQ5pSI3GV+FGLIEoTDqAEWy0VVkB666tPU+EClPCLyGLKvWS1g8ggScuWRRf+KJ+lDhGNKUDtWtcqleaAxGqsBRTb+vCrIxAutWNuVTkD9eUYhxhiuNpDTI4I2BBBEDBdyqIRgYJEToYwHxPpafxin7rprahtllh+F08NF0PNLUFDcUDtx+NmgqZcXr/4yhMd3s5ySZdoSLlwUC0KUwdaDFMnqGWK59pNDK8M0mDqHAAQx6P38jfhdM6fKp4mBYk5x4PXl7wlRylcJoAnqpwB+AZUetT1txaGJpgaQcc1l1qySwdoTuVSgO+IdZszHYYmXBXjDdQUUWsxNEwB4vU6MU0CmOKlVTEeNMPE3EBWL82ZqKOqpXoCJnXkfwRCHl3gGYV+R4FnF9rSwsTJS/Tj5wePvu7XJnCZ8xv1n3UERnUJgqxNlRd4S/yKUoXpmi43hfyQ3HXep5BwwYCK0veUYWrORKrK8xMnylN/g0Lgks07OHVJKuOWHknxa163oi3j6mFUPgcuNtK6Ka0rn5acGtKuV2Qw0fxN2eI5l5dGqptCmvDaMlXrHomQ3tsRegeuLHfo/igHPkr0KKjOS7IpMprfyDoqUJv7JPAjOJMcEtcRVzPz6SKGD/N3cTPHQ0PAHB5RmB2rAxzhxTn8B0VtOxjl6cvdv18pNOflRm/GRxVDGyYTFIu2UNGs5eWDKvJojtpPB6jl2x0vfLXhgknj8jcNLw29x4GRoiRHM6T3gmCTwsImJcWiInRf7gWK3ZVm7MiGdWttehgTFRPr/jAAMsFmdJ9k+HC+bK5Qy/sk8AJdDSrQrmPm00UMHx4hLm5S2HDw92mYV1m4TnCEh9riKry2HYzy9OUeb6wmbc7LTR47UTsMk4k2lquWl48ZPdNF6qHH264XJo3L3zS8NCL81yAIAtJ7pYOK3bvXrVotaf3qMp2PprIyDoJS8fBDhm+spfwdz1/cWrtpBhlkcAwD8YLv6VOSvN7qdKQhZraOE9n8xf56zHUZZJDBsQ/zHMay1K+8CnQuJg763gjPIIMMMjgGIBGQl4Tu9V90HyTyJbkMMsggg2MA6nquE9WiJ8XuT9/zYr4LwjeK6LufmZRJmZRJx0BywpoPonEQoVFHR0GYQqmVSZmUSZl09CbEPsmEaUsPQHrPe/n5wYfHR4y3kINm9vRpWRF+uIHehILT5cw2s81sM9ujfmvze0WGnDDcXPNRbJQ4GLZC5hkyhUtaHxpxkN6EH5d7ZpvZZraZ7VGypRDnFwcfmVDDL6T2fYFEBhlkkMGxAQlwrguAzvdJIhEs9uQbMlxO1JmImEEGGRxjoLNclY2BxEH+Y0QzcR68ziCDDDI4xsBxkJ4vpPUftpKhEGg8dZ1BBhlkcAzDun/UqF+OHx9zGow8AqFrm0pYNOlTQYY+MTL0iZGhT4yvG33qAE+B8I8E/j/Klka6aL6X/QAAAABJRU5ErkJggg==';

  if (window.__HiddenXDeltLoaded) {
    console.warn('[HiddenX-Delt] already loaded');
    return;
  }
  window.__HiddenXDeltLoaded = true;

  let ws = null;
  let reconnectTimer = null;
  let reconnectAttempt = 0;
  let manualClose = false;
  let authed = false;
  let messages = [];
  let lastStatus = 'idle';
  let lastMeta = { name: '', nickname2: '', tag: '' };

  const state = {
    root: null,
    toggle: null,
    panel: null,
    status: null,
    keyInput: null,
    nameInput: null,
    nick2Input: null,
    tagInput: null,
    log: null,
    chatInput: null,
    connectBtn: null,
    disconnectBtn: null,
    saveBtn: null,
    copyDiagBtn: null,
    body: null
  };

  function log(...args) {
    console.log('[HiddenX-Delt]', ...args);
  }

  function warn(...args) {
    console.warn('[HiddenX-Delt]', ...args);
  }

  function safeGet(key, fallback = '') {
    try {
      const value = localStorage.getItem(key);
      return value == null ? fallback : value;
    } catch (_) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, String(value || '')); } catch (_) {}
  }

  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch (_) {}
  }

  function randomId() {
    try {
      const a = new Uint8Array(16);
      crypto.getRandomValues(a);
      return Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
    } catch (_) {
      return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
    }
  }

  function getDeviceId() {
    let id = safeGet(DEVICE_STORAGE, '');
    if (!id) {
      id = randomId();
      safeSet(DEVICE_STORAGE, id);
    }
    return id;
  }

  function getDeltNickname() {
    const selectors = [
      'input[name="nick"]', 'input[name="nickname"]', 'input[name="name"]',
      '#nick', '#nickname', '#name', '#playerName', '.nickname input'
    ];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el && 'value' in el && String(el.value || '').trim()) return String(el.value).trim();
    }
    return '';
  }

  function getMeta() {
    const uiName = state.nameInput ? state.nameInput.value : '';
    const name = String(uiName || safeGet(NAME_STORAGE, '') || getDeltNickname() || 'DeltPlayer').trim() || 'DeltPlayer';
    const nickname2 = String((state.nick2Input ? state.nick2Input.value : '') || safeGet(NICK2_STORAGE, '') || '').trim();
    const tag = String((state.tagInput ? state.tagInput.value : '') || safeGet(TAG_STORAGE, '') || '').trim().toUpperCase();
    return { name, nickname2, tag };
  }

  function getKey() {
    return String((state.keyInput ? state.keyInput.value : '') || safeGet(KEY_STORAGE, '') || window.__ogxKey || '').trim();
  }

  function updateStatus(text, kind = '') {
    lastStatus = text;
    if (!state.status) return;
    state.status.textContent = text;
    state.status.dataset.kind = kind;
    if (state.connectBtn) state.connectBtn.disabled = !!(ws && ws.readyState === WebSocket.OPEN);
    if (state.disconnectBtn) state.disconnectBtn.disabled = !ws;
    if (state.toggle) state.toggle.dataset.state = kind;
  }

  function addMessage(from, text, system = false) {
    const item = { from: String(from || ''), text: String(text || ''), system, time: new Date().toLocaleTimeString() };
    messages.push(item);
    if (messages.length > LOG_LIMIT) messages = messages.slice(messages.length - LOG_LIMIT);
    renderMessages();
    try {
      if (typeof window.__xprvtPushMessage === 'function') {
        window.__xprvtPushMessage({
          type: 1,
          color: null,
          time: Date.now(),
          nick: system ? 'SERVER' : item.from,
          hasReservedName: false,
          tag: '',
          message: item.text,
          room: 2
        });
      }
    } catch (_) {}
  }

  function renderMessages() {
    if (!state.log) return;
    state.log.innerHTML = '';
    for (const m of messages) {
      const row = document.createElement('div');
      row.className = 'hxd-row' + (m.system ? ' hxd-system' : '');
      const time = document.createElement('span');
      time.className = 'hxd-time';
      time.textContent = m.time;
      const from = document.createElement('span');
      from.className = 'hxd-from';
      from.textContent = m.system ? 'SERVER' : (m.from || '??');
      const text = document.createElement('span');
      text.className = 'hxd-text';
      text.textContent = m.text;
      row.append(time, from, text);
      state.log.appendChild(row);
    }
    state.log.scrollTop = state.log.scrollHeight;
  }

  function sendJson(payload) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return false;
    try {
      ws.send(JSON.stringify(payload));
      return true;
    } catch (e) {
      warn('send failed', e);
      return false;
    }
  }

  function sendMeta(force = false) {
    const meta = getMeta();
    if (!force && meta.name === lastMeta.name && meta.nickname2 === lastMeta.nickname2 && meta.tag === lastMeta.tag) return;
    lastMeta = meta;
    sendJson({ type: 'meta', nickname2: meta.nickname2, tag: meta.tag });
  }

  function connect() {
    const key = getKey();
    if (!key) {
      openPanel('settings');
      updateStatus('Missing HiddenX key. Paste your key then Connect.', 'bad');
      return;
    }

    safeSet(KEY_STORAGE, key);
    const meta = getMeta();
    safeSet(NAME_STORAGE, meta.name);
    safeSet(NICK2_STORAGE, meta.nickname2);
    safeSet(TAG_STORAGE, meta.tag);
    lastMeta = meta;

    manualClose = false;
    authed = false;

    if (ws) {
      try { ws.close(); } catch (_) {}
      ws = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    updateStatus('Connecting to HiddenX...', 'warn');
    log('connecting', CHAT_WS, 'room=', ROOM, 'hostname=', location.hostname);

    try {
      ws = new WebSocket(CHAT_WS);
    } catch (e) {
      updateStatus('WebSocket create failed: ' + (e.message || e), 'bad');
      return;
    }

    ws.onopen = function () {
      reconnectAttempt = 0;
      updateStatus('Socket open. Authorizing...', 'warn');
      sendJson({
        type: 'auth',
        key,
        name: meta.name,
        nickname2: meta.nickname2,
        tag: meta.tag,
        deviceId: getDeviceId()
      });
    };

    ws.onmessage = function (e) {
      if (typeof e.data === 'string' && e.data === '{"type":"srv_keep"}') {
        sendJson({ type: 'pong' });
        return;
      }
      let d = null;
      try { d = JSON.parse(e.data); } catch (_) {
        addMessage('raw', String(e.data || ''), true);
        return;
      }

      if (d.type === 'system') {
        addMessage('system', d.text || '', true);
        if (d.text === 'Authorized') {
          authed = true;
          updateStatus('HiddenX connected on delt.io', 'good');
          sendJson({ type: 'sub', room: ROOM });
          return;
        }
        if (/invalid|denied|unauthorized|bad/i.test(String(d.text || ''))) {
          updateStatus('HiddenX authorization failed: ' + d.text, 'bad');
        }
        return;
      }

      if (d.type === 'msg' && (!d.room || d.room === ROOM)) {
        addMessage(d.from || '??', d.text || '');
        return;
      }

      if (d.type === 'skinByPID' && d.playerID != null && d.skin) {
        window.__ogxSkinsByPID = window.__ogxSkinsByPID || {};
        window.__ogxSkinsByPID[d.playerID] = String(d.skin);
        return;
      }

      if (d.type === 'skinSyncByPID' && Array.isArray(d.skins)) {
        window.__ogxSkinsByPID = window.__ogxSkinsByPID || {};
        d.skins.forEach(entry => {
          if (entry && entry.playerID != null && entry.skin) window.__ogxSkinsByPID[entry.playerID] = String(entry.skin);
        });
        return;
      }
    };

    ws.onerror = function (e) {
      warn('websocket error', e);
      updateStatus('HiddenX socket error. Check Network > WS.', 'bad');
    };

    ws.onclose = function (ev) {
      const reason = ev && ev.reason ? ' / ' + ev.reason : '';
      ws = null;
      authed = false;
      updateStatus('HiddenX closed: ' + (ev ? ev.code : 'unknown') + reason, manualClose ? '' : 'bad');
      if (manualClose) return;
      reconnectAttempt += 1;
      const delay = Math.min(2000 * reconnectAttempt, 15000);
      updateStatus('Reconnecting HiddenX in ' + Math.round(delay / 1000) + 's...', 'warn');
      reconnectTimer = setTimeout(function () {
        reconnectTimer = null;
        connect();
      }, delay);
    };
  }

  function disconnect() {
    manualClose = true;
    authed = false;
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    if (ws) { try { ws.close(); } catch (_) {} ws = null; }
    updateStatus('Disconnected', '');
  }

  function sendChat() {
    if (!state.chatInput) return;
    const text = String(state.chatInput.value || '').trim();
    if (!text) return;
    if (!ws || ws.readyState !== WebSocket.OPEN || !authed) {
      updateStatus('Connect HiddenX before sending.', 'bad');
      return;
    }
    state.chatInput.value = '';
    sendJson({ type: 'msg', text, room: ROOM });
    addMessage(getMeta().name, text);
  }

  function copyDiagnostics() {
    const data = {
      addon: 'HiddenX for delt.io',
      version: HIDDENX_VERSION,
      page: location.href,
      hostname: location.hostname,
      wsTarget: CHAT_WS,
      room: ROOM,
      wsReadyState: ws ? ws.readyState : null,
      authed,
      status: lastStatus,
      keySaved: !!safeGet(KEY_STORAGE, ''),
      deviceId: getDeviceId(),
      messageCount: messages.length,
      time: new Date().toISOString()
    };
    const text = JSON.stringify(data, null, 2);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { updateStatus('Diagnostics copied.', 'good'); }, function () { console.log(text); updateStatus('Diagnostics printed in console.', 'warn'); });
    } else {
      console.log(text);
      updateStatus('Diagnostics printed in console.', 'warn');
    }
  }

  function openPanel(mode = 'chat') {
    if (!state.panel) return;
    state.panel.classList.add('open');
    state.body.dataset.mode = mode;
    if (mode === 'settings' && state.keyInput) state.keyInput.focus();
    if (mode === 'chat' && state.chatInput) state.chatInput.focus();
  }

  function closePanel() {
    if (state.panel) state.panel.classList.remove('open');
  }

  function togglePanel() {
    if (!state.panel) return;
    if (state.panel.classList.contains('open')) closePanel();
    else openPanel('chat');
  }

  function savePanelValues() {
    safeSet(KEY_STORAGE, state.keyInput ? state.keyInput.value : '');
    safeSet(NAME_STORAGE, state.nameInput ? state.nameInput.value : '');
    safeSet(NICK2_STORAGE, state.nick2Input ? state.nick2Input.value : '');
    safeSet(TAG_STORAGE, state.tagInput ? String(state.tagInput.value || '').toUpperCase() : '');
    updateStatus('Saved.', 'good');
  }

  function applySavedPosition() {
    const pos = safeGet(POS_STORAGE, '');
    if (!pos || !state.panel) return;
    try {
      const p = JSON.parse(pos);
      if (typeof p.left === 'number' && typeof p.top === 'number') {
        state.panel.style.left = Math.max(0, Math.min(window.innerWidth - 120, p.left)) + 'px';
        state.panel.style.top = Math.max(0, Math.min(window.innerHeight - 60, p.top)) + 'px';
        state.panel.style.right = 'auto';
        state.panel.style.bottom = 'auto';
      }
    } catch (_) {}
  }

  function makeDraggable() {
    if (!state.panel) return;
    const header = state.panel.querySelector('.hxd-head');
    if (!header) return;
    let dragging = false, sx = 0, sy = 0, left = 0, top = 0;
    header.addEventListener('pointerdown', function (e) {
      if (e.target && e.target.closest && e.target.closest('button')) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      const r = state.panel.getBoundingClientRect();
      left = r.left; top = r.top;
      state.panel.setPointerCapture && state.panel.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    header.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      const nl = Math.max(0, Math.min(window.innerWidth - 120, left + e.clientX - sx));
      const nt = Math.max(0, Math.min(window.innerHeight - 60, top + e.clientY - sy));
      state.panel.style.left = nl + 'px';
      state.panel.style.top = nt + 'px';
      state.panel.style.right = 'auto';
      state.panel.style.bottom = 'auto';
    });
    header.addEventListener('pointerup', function () {
      if (!dragging) return;
      dragging = false;
      const r = state.panel.getBoundingClientRect();
      safeSet(POS_STORAGE, JSON.stringify({ left: r.left, top: r.top }));
    });
  }

  function injectUI() {
    if (document.getElementById('hiddenx-delt-root')) return;

    const style = document.createElement('style');
    style.id = 'hiddenx-delt-style';
    style.textContent = `
#hiddenx-delt-root{position:fixed;z-index:2147483600;font-family:Rajdhani,Segoe UI,Arial,sans-serif;color:#eef3ff}
.hxd-toggle{position:fixed;left:14px;top:90px;z-index:2147483601;display:flex;align-items:center;gap:7px;border:1px solid rgba(255,255,255,.14);background:rgba(8,10,18,.82);color:#fff;border-radius:10px;padding:8px 10px;cursor:pointer;box-shadow:0 10px 28px rgba(0,0,0,.4);backdrop-filter:blur(8px);font-weight:700;letter-spacing:.04em}
.hxd-toggle img{width:22px;height:22px;border-radius:6px}
.hxd-toggle .dot{width:8px;height:8px;border-radius:50%;background:#777}
.hxd-toggle[data-state="warn"] .dot{background:#ffb020}
.hxd-toggle[data-state="good"] .dot{background:#38e27d}
.hxd-toggle[data-state="bad"] .dot{background:#ff4f6d}
.hxd-panel{position:fixed;left:14px;top:136px;width:380px;max-width:calc(100vw - 28px);height:500px;max-height:calc(100vh - 150px);display:none;flex-direction:column;background:linear-gradient(180deg,rgba(13,16,28,.97),rgba(4,6,12,.97));border:1px solid rgba(137,159,255,.22);border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.55);overflow:hidden;backdrop-filter:blur(12px)}
.hxd-panel.open{display:flex}
.hxd-head{display:flex;align-items:center;gap:9px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08);cursor:move;user-select:none;background:rgba(255,255,255,.035)}
.hxd-head img{width:28px;height:28px;border-radius:8px}
.hxd-title{font-weight:800;letter-spacing:.08em;line-height:1}
.hxd-sub{font-size:11px;color:#9aa7c7;margin-top:2px}
.hxd-spacer{flex:1}
.hxd-icon-btn{border:0;background:rgba(255,255,255,.08);color:#dbe5ff;border-radius:8px;padding:6px 8px;cursor:pointer;font-weight:800}
.hxd-tabs{display:flex;gap:6px;padding:9px 10px;border-bottom:1px solid rgba(255,255,255,.08)}
.hxd-tab{flex:1;border:0;border-radius:9px;padding:8px;background:rgba(255,255,255,.06);color:#b9c5e6;cursor:pointer;font-weight:800}
.hxd-body[data-mode="chat"] .hxd-tab[data-tab="chat"],.hxd-body[data-mode="settings"] .hxd-tab[data-tab="settings"]{background:rgba(80,110,255,.34);color:#fff}
.hxd-status{padding:8px 11px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.08);color:#b8c2dd;background:rgba(0,0,0,.16)}
.hxd-status[data-kind="good"]{color:#9dffc2}.hxd-status[data-kind="warn"]{color:#ffd18b}.hxd-status[data-kind="bad"]{color:#ff9aac}
.hxd-view{display:none;flex:1;min-height:0;padding:10px}
.hxd-body[data-mode="chat"] .hxd-chat,.hxd-body[data-mode="settings"] .hxd-settings{display:flex}
.hxd-chat{flex-direction:column;gap:8px}
.hxd-log{flex:1;min-height:0;overflow:auto;border:1px solid rgba(255,255,255,.08);background:rgba(0,0,0,.22);border-radius:10px;padding:8px;font-size:13px}
.hxd-row{display:grid;grid-template-columns:42px 72px 1fr;gap:6px;padding:3px 0;border-bottom:1px solid rgba(255,255,255,.035)}
.hxd-row:last-child{border-bottom:0}
.hxd-time{color:#7080aa;font-size:11px}
.hxd-from{color:#7ea7ff;font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.hxd-system .hxd-from,.hxd-system .hxd-text{color:#ffc86b}
.hxd-text{color:#ecf2ff;word-break:break-word}
.hxd-send{display:flex;gap:7px}
.hxd-input,.hxd-settings input{width:100%;box-sizing:border-box;border:1px solid rgba(255,255,255,.12);background:rgba(0,0,0,.32);color:#fff;border-radius:9px;padding:9px 10px;outline:none;font:600 13px/1.2 Segoe UI,Arial,sans-serif}
.hxd-input:focus,.hxd-settings input:focus{border-color:rgba(126,167,255,.7)}
.hxd-btn{border:0;border-radius:9px;padding:9px 12px;background:#3b65ff;color:#fff;font-weight:900;cursor:pointer}
.hxd-btn.secondary{background:rgba(255,255,255,.08);color:#dbe5ff}
.hxd-btn.danger{background:#633;color:#ffd6d6}
.hxd-btn:disabled{opacity:.45;cursor:not-allowed}
.hxd-settings{flex-direction:column;gap:9px;overflow:auto}
.hxd-field label{display:block;margin:0 0 4px;color:#aab7dc;font-size:12px;font-weight:800}
.hxd-row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.hxd-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:2px}
.hxd-note{font-size:12px;color:#8c98bc;line-height:1.35;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.07);border-radius:9px;padding:9px}
@media(max-width:520px){.hxd-panel{width:calc(100vw - 20px);left:10px!important;right:10px;top:120px}.hxd-row2{grid-template-columns:1fr}}
`;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'hiddenx-delt-root';
    root.innerHTML = `
<button class="hxd-toggle" type="button" data-state=""><img src="${HIDDENX_LOGO}" alt=""><span>HIDDENX</span><span class="dot"></span></button>
<div class="hxd-panel" role="dialog" aria-label="HiddenX Panel">
  <div class="hxd-head">
    <img src="${HIDDENX_LOGO}" alt="">
    <div><div class="hxd-title">HIDDENX</div><div class="hxd-sub">delt.io native addon · no ONYX boot</div></div>
    <div class="hxd-spacer"></div>
    <button class="hxd-icon-btn hxd-min" type="button">—</button>
    <button class="hxd-icon-btn hxd-close" type="button">×</button>
  </div>
  <div class="hxd-body" data-mode="chat">
    <div class="hxd-tabs">
      <button class="hxd-tab" type="button" data-tab="chat">CHAT</button>
      <button class="hxd-tab" type="button" data-tab="settings">SETTINGS</button>
    </div>
    <div class="hxd-status">Idle</div>
    <div class="hxd-view hxd-chat">
      <div class="hxd-log"></div>
      <div class="hxd-send"><input class="hxd-input hxd-chat-input" placeholder="Send HiddenX message..."><button class="hxd-btn hxd-send-btn" type="button">SEND</button></div>
    </div>
    <div class="hxd-view hxd-settings">
      <div class="hxd-field"><label>HiddenX / OGX key</label><input class="hxd-key" placeholder="Paste your key" autocomplete="off"></div>
      <div class="hxd-row2">
        <div class="hxd-field"><label>Name</label><input class="hxd-name" placeholder="Name"></div>
        <div class="hxd-field"><label>Cell 2 nickname</label><input class="hxd-nick2" placeholder="Second nickname"></div>
      </div>
      <div class="hxd-field"><label>Tag</label><input class="hxd-tag" placeholder="TAG" maxlength="8"></div>
      <div class="hxd-actions">
        <button class="hxd-btn hxd-save" type="button">SAVE</button>
        <button class="hxd-btn hxd-connect" type="button">CONNECT</button>
        <button class="hxd-btn danger hxd-disconnect" type="button">DISCONNECT</button>
        <button class="hxd-btn secondary hxd-copydiag" type="button">COPY DIAG</button>
      </div>
      <div class="hxd-note">دي نسخة HiddenX بس: مش بتبدّل صفحة Delt ومش بتشغّل ONYX أو Senpa engine. المفروض في Network يظهر WebSocket باسم <b>xprivt.onrender.com/chat</b> لو الـ key صحيح.</div>
    </div>
  </div>
</div>`;
    document.body.appendChild(root);

    state.root = root;
    state.toggle = root.querySelector('.hxd-toggle');
    state.panel = root.querySelector('.hxd-panel');
    state.body = root.querySelector('.hxd-body');
    state.status = root.querySelector('.hxd-status');
    state.keyInput = root.querySelector('.hxd-key');
    state.nameInput = root.querySelector('.hxd-name');
    state.nick2Input = root.querySelector('.hxd-nick2');
    state.tagInput = root.querySelector('.hxd-tag');
    state.log = root.querySelector('.hxd-log');
    state.chatInput = root.querySelector('.hxd-chat-input');
    state.connectBtn = root.querySelector('.hxd-connect');
    state.disconnectBtn = root.querySelector('.hxd-disconnect');
    state.saveBtn = root.querySelector('.hxd-save');
    state.copyDiagBtn = root.querySelector('.hxd-copydiag');

    state.keyInput.value = safeGet(KEY_STORAGE, '');
    state.nameInput.value = safeGet(NAME_STORAGE, '') || getDeltNickname();
    state.nick2Input.value = safeGet(NICK2_STORAGE, '');
    state.tagInput.value = safeGet(TAG_STORAGE, '');

    state.toggle.addEventListener('click', togglePanel);
    root.querySelector('.hxd-close').addEventListener('click', closePanel);
    root.querySelector('.hxd-min').addEventListener('click', closePanel);
    root.querySelectorAll('.hxd-tab').forEach(btn => btn.addEventListener('click', function () { openPanel(btn.dataset.tab); }));
    root.querySelector('.hxd-send-btn').addEventListener('click', sendChat);
    state.chatInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); sendChat(); } });
    state.saveBtn.addEventListener('click', savePanelValues);
    state.connectBtn.addEventListener('click', connect);
    state.disconnectBtn.addEventListener('click', disconnect);
    state.copyDiagBtn.addEventListener('click', copyDiagnostics);
    ['input','change'].forEach(evt => {
      state.nameInput.addEventListener(evt, () => sendMeta(false));
      state.nick2Input.addEventListener(evt, () => sendMeta(false));
      state.tagInput.addEventListener(evt, () => { state.tagInput.value = String(state.tagInput.value || '').toUpperCase(); sendMeta(false); });
    });

    updateStatus(safeGet(KEY_STORAGE, '') ? 'Ready. Press Connect.' : 'Paste HiddenX key in Settings.', safeGet(KEY_STORAGE, '') ? 'warn' : 'bad');
    addMessage('HiddenX', 'Loaded on delt.io without replacing the Delt client.', true);
    applySavedPosition();
    makeDraggable();
  }

  function exposeApi() {
    window.HiddenXDelt = {
      version: HIDDENX_VERSION,
      connect,
      disconnect,
      open: () => openPanel('chat'),
      settings: () => openPanel('settings'),
      send: (text) => { if (!text) return false; return sendJson({ type: 'msg', text: String(text), room: ROOM }); },
      status: () => ({ readyState: ws ? ws.readyState : null, authed, lastStatus, target: CHAT_WS, room: ROOM }),
      clearKey: () => { safeRemove(KEY_STORAGE); if (state.keyInput) state.keyInput.value = ''; updateStatus('Key removed.', 'bad'); }
    };
  }

  function boot() {
    if (!document.body || !document.head) {
      setTimeout(boot, 50);
      return;
    }
    injectUI();
    exposeApi();
    setInterval(function () {
      if (!ws || ws.readyState !== WebSocket.OPEN || !authed) return;
      sendMeta(false);
    }, 4000);
    log('loaded on', location.href, 'hostname=', location.hostname, 'version=', HIDDENX_VERSION);
  }

  boot();
})();
