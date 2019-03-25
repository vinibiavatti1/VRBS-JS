var debug = false;
var variaveis = [];
var labels = [];
var funcoes = [];
var chamadas = [];
var listas = [];
var cursor = 0;
var lista_comandos = [{
    nome: "var",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[0], parametros[1]);
        renderizarTabelaVariaveis();
    }
}, {
    nome: "calc",
    numero_parametros: 4,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        if (isNaN(parametros[0]) || isNaN(parametros[2])) {
            atribuirVariavel(parametros[3], parametros[0] + parametros[2]);
            renderizarTabelaVariaveis();
            return;
        }
        if (parametros[1] == "+") {
            atribuirVariavel(parametros[3], parseFloat(parametros[0]) + parseFloat(parametros[2]));
        } else if (parametros[1] == "-") {
            atribuirVariavel(parametros[3], parseFloat(parametros[0]) - parseFloat(parametros[2]));
        } else if (parametros[1] == "*") {
            atribuirVariavel(parametros[3], parseFloat(parametros[0]) * parseFloat(parametros[2]));
        } else if (parametros[1] == "/") {
            atribuirVariavel(parametros[3], parseFloat(parametros[0]) / parseFloat(parametros[2]));
        };
        renderizarTabelaVariaveis();
    }
}, {
    nome: "pow",
    numero_parametros: 3,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[2], Math.pow(parseFloat(parametros[0]), parseFloat(parametros[1])));
        renderizarTabelaVariaveis();
    }
}, {
    nome: "label",
    numero_parametros: 1,
    executar: function (parametros) {

    }
}, {
    nome: "goto",
    numero_parametros: 1,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        var indice = getIndiceLabel(parametros[0]);
        if (indice != null) {
            cursor = indice;
        }
    }
}, {
    nome: "if",
    numero_parametros: 4,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        var indice = getIndiceLabel(parametros[3]);
        if (indice == null) {
            return;
        }
        if (parametros[1] == "=") {
            if (parametros[0] == parametros[2]) {
                cursor = indice;
            }
        } else if (parametros[1] == "!=") {
            if (parametros[0] != parametros[2]) {
                cursor = indice;
            }
        } else if (parametros[1] == ">") {
            if (parseFloat(parametros[0]) > parseFloat(parametros[2])) {
                cursor = indice;
            }
        } else if (parametros[1] == "<") {
            if (parseFloat(parametros[0]) < parseFloat(parametros[2])) {
                cursor = indice;
            }
        } else if (parametros[1] == ">=") {
            if (parseFloat(parametros[0]) >= parseFloat(parametros[2])) {
                cursor = indice;
            }
        } else if (parametros[1] == "<=") {
            if (parseFloat(parametros[0]) <= parseFloat(parametros[2])) {
                cursor = indice;
            }
        }
    }
}, {
    nome: "print",
    numero_parametros: 1,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        $("#saida").append(parametros[0]);
    }
}, {
    nome: "printLn",
    numero_parametros: 1,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        $("#saida").append(parametros[0] + "\n");
    }
}, {
    nome: "log",
    numero_parametros: 1,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        console.log(parametros[0]);
    }
}, {
    nome: "concat",
    numero_parametros: 3,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[2], parametros[0] + "" + parametros[1]);
        renderizarTabelaVariaveis();
    }
}, {
    nome: "input",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        var valor = prompt(parametros[0]);
        atribuirVariavel(parametros[1], valor);
        renderizarTabelaVariaveis();
    }
}, {
    nome: "sin",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[1], Math.sin(parseFloat(parametros[0])));
        renderizarTabelaVariaveis();
    }
}, {
    nome: "cos",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[1], Math.cos(parseFloat(parametros[0])));
        renderizarTabelaVariaveis();
    }
}, {
    nome: "tan",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[1], Math.tan(parseFloat(parametros[0])));
        renderizarTabelaVariaveis();
    }
}, {
    nome: "func",
    numero_parametros: 1,
    executar: function (parametros) {

    }
}, {
    nome: "call",
    numero_parametros: 1,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        var indice = getIndiceFuncao(parametros[0]);
        if (indice != null) {
            chamadas.push(cursor);
            cursor = indice;
        }
    }
}, {
    nome: "end",
    numero_parametros: 0,
    executar: function (parametros) {
        if (chamadas.length) {
            cursor = chamadas.pop();
        }
    }
}, {
    nome: "list",
    numero_parametros: 1,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirLista(parametros[0]);
    }
}, {
    nome: "add",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        listas.forEach(function(lista) {
            if(lista.nome == parametros[0]) {
                lista.valores.push(parametros[1]);
                return;
            }
        });
    }
}, {
    nome: "get",
    numero_parametros: 3,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        listas.forEach(function(lista) {
            if(lista.nome == parametros[0]) {
                var valor = lista.valores[parametros[1]];
                atribuirVariavel(parametros[2], valor);
                return;
            }
        });
    }
}, {
    nome: "length",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        console.log(listas);
        listas.forEach(function(lista) {
            if(lista.nome == parametros[0]) {
                var valor = lista.valores.length;
                atribuirVariavel(parametros[1], valor);
                return;
            }
        });
    }
}, {
    nome: "inc",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[1], parseFloat(parametros[0]) + 1);
    }
}, {
    nome: "dec",
    numero_parametros: 2,
    executar: function (parametros) {
        parametros = atribuirValoresVariaveis(parametros);
        atribuirVariavel(parametros[1], parseFloat(parametros[0]) - 1);
    }
}];

/**
 * Executar documento
 */
$(document).ready(function () {
    if (debug) {
        $("#tabela-comandos").show();
        $("#tabela-variaveis").show();
    }
});

/**
 * Obter indice do label
 */
function getIndiceLabel(nome) {
    var indice = null;
    labels.forEach(function (label) {
        if (label.nome == nome) {
            indice = label.indice;
        }
    });
    return indice;
}

/**
 * Obter indice da funcao
 */
function getIndiceFuncao(nome) {
    var indice = null;
    funcoes.forEach(function (funcao) {
        if (funcao.nome == nome) {
            indice = funcao.indice;
        }
    });
    return indice;
}

/**
 * Atribuir lista
 * @param {*} nome 
 * @param {*} valor 
 */
function atribuirLista(nome) {
    listas.forEach(function (lista, i) {
        if (lista.nome == nome) {
            listas.splice(i, 1);
            return;
        }
    });
    listas.push({
        nome: nome,
        valores: []
    });
}

/**
 * Atribuir valor a variavel
 * @param {*} nome 
 * @param {*} valor 
 */
function atribuirVariavel(nome, valor) {
    variaveis.forEach(function (variavel, i) {
        if (variavel.nome == nome) {
            variaveis.splice(i, 1);
            return;
        }
    });
    variaveis.push({
        nome: nome,
        valor: valor
    });
}

/**
 * Adicionar Label
 * @param {*} nome 
 * @param {*} valor 
 */
function addLabel(nome, indice) {
    labels.forEach(function (label, i) {
        if (label.nome == nome) {
            labels.splice(i, 1);
            return;
        }
    });
    labels.push({
        nome: nome,
        indice: indice
    });
}

/**
 * Adicionar Funcao
 * @param {*} nome 
 * @param {*} valor 
 */
function addFuncao(nome, indice) {
    funcoes.forEach(function (funcao, i) {
        if (funcao.nome == nome) {
            funcoes.splice(i, 1);
            return;
        }
    });
    funcoes.push({
        nome: nome,
        indice: indice
    });
}

/**
 * Converter parametros para o valor da variavel
 * @param {*} parametros 
 */
function atribuirValoresVariaveis(parametros) {
    var parametros_novos = [];
    parametros.forEach(function (parametro) {
        parametros_novos.push(getValorVariavel(parametro));
    });
    return parametros_novos;
}

/**
 * Validar se é variável
 * @param {*} nome 
 */
function isVariavel(nome) {
    return nome.startsWith("$");
}

/**
 * Obter valor da variavel
 * @param {*} nome 
 */
function getValorVariavel(nome) {
    if (!isVariavel(nome)) {
        return nome;
    }
    var valor = null;
    nome = nome.replace("$", "");
    variaveis.forEach(function (variavel, i) {
        if (variavel.nome == nome) {
            valor = variavel.valor;
        }
    });
    return valor;
}

/**
 * Executar
 */
function executar() {
    var codigo = $("#codigo").val();
    $("#saida").html("");
    $("#variaveis").empty();
    $("#comandos").empty();
    variaveis = [];
    comandos = [];
    var comandos = getComandos(codigo);
    renderizarTabelaComandos(comandos);
    console.log("Compilando...");
    var valido = validarComandos(comandos);
    if (!valido) {
        return;
    }
    console.log("Compilado com sucesso.");
    console.log("Processando labels...");
    processarLabels(comandos);
    console.log("Processando funções...");
    processarFuncoes(comandos);
    console.log("Executando...");
    executarComandos(comandos);
}

/**
 * Processar Labels
 * @param {*} comandos 
 */
function processarLabels(comandos) {
    comandos.forEach(function (c, i) {
        if (c.nome == "label") {
            var parametros = getParametros(c);
            addLabel(parametros[0], i);
        }
    });
}

/**
 * Processar Labels
 * @param {*} comandos 
 */
function processarFuncoes(comandos) {
    comandos.forEach(function (c, i) {
        if (c.nome == "func") {
            var parametros = getParametros(c);
            addFuncao(parametros[0], i);
        }
    });
}

/**
 * Executar Comandos
 * @param {*} comandos 
 */
function executarComandos(comandos) {

    cursor = -1;
    ignorar = false;
    while (true) {
        cursor++;
        if (!comandos[cursor]) {
            return;
        }
        for (var i2 = 0; i2 < lista_comandos.length; i2++) {
            if (!comandos[cursor]) {
                return;
            }
            if (comandos[cursor].nome == "func") {
                ignorar = true;
            }
            if (comandos[cursor].nome == "end") {
                ignorar = false;
            }
            if (lista_comandos[i2].nome == comandos[cursor].nome) {
                var parametros = getParametros(comandos[cursor]);
                try {
                    if (!ignorar) {
                        console.log("Comando: " + lista_comandos[i2].nome + " - Parâmetros: " + parametros);
                        lista_comandos[i2].executar(parametros);
                    }
                    break;
                } catch (e) {
                    $("#saida").val(e);
                    return;
                }
            }
        }
    }
}

/**
 * Validar Parametros
 * @param {*} comandos 
 */
function validarComandos(comandos) {
    var valido = true;
    var funcaoValida;
    comandos.forEach(function (c, i) {
        funcaoValida = false;
        lista_comandos.forEach(function (lista_comando, i2) {
            if (lista_comando.nome == c.nome) {
                funcaoValida = true;
                var parametros = getParametros(c);
                if (lista_comando.numero_parametros != 0) {
                    if (parametros.length != lista_comando.numero_parametros) {
                        $("#saida").val(`Erro: Número de parâmetros inválido para função '${lista_comando.nome}' na linha ${i}.`);
                        valido = false;
                    }
                }
            }
        });
        if (!funcaoValida) {
            $("#saida").val(`Erro: Função inválida: '${c.nome}' na linha ${i}.`);
            valido = false;
        }
    });
    return valido;
}

/**
 * Obter parametros
 * @param {*} comando 
 */
function getParametros(comando) {
    var parametros_texto = comando.parametros;
    parametros_texto = parametros_texto.replace("(", "");
    parametros_texto = parametros_texto.replace(")", "");
    var parametros = parametros_texto.split(",");
    var retorno = [];
    parametros.forEach(function(par) {
        retorno.push(par.trim());
    });
    return retorno;
}

/**
 * Obter Comandos
 * @param {*} codigo 
 */
function getComandos(codigo) {
    var expressao = /(\w+)(\([a-zA-Z\,0-9\.$_\s\+\-\*\/\>\<\=]*\))/g;
    var combinacoes = [];
    var combinacao;
    while (combinacao = expressao.exec(codigo)) {
        combinacoes.push({
            nome: combinacao[1],
            parametros: combinacao[2]
        });
    }
    return combinacoes;
}

/**
 * Renderizar tabela de comandos
 * @param {*} comandos 
 */
function renderizarTabelaComandos(comandos) {
    if (!debug) {
        return;
    }
    var append;
    $("#comandos").empty();
    comandos.forEach(function (comando, i) {
        append = `<tr><td>${i}</td><td>${comando.nome + "" + comando.parametros}</td></tr>`;
        $("#comandos").append(append);
    });
}

/**
 * Renderizar Variaveis
 */
function renderizarTabelaVariaveis() {
    if (!debug) {
        return;
    }
    var append;
    $("#variaveis").empty();
    variaveis.forEach(function (variavel, i) {
        append = `<tr><td>${variavel.nome}</td><td>${variavel.valor}</td></tr>`;
        $("#variaveis").append(append);
    });
}