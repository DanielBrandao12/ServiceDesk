import { Request, Response } from 'express';
import { Categorias } from '../models/index';
import { CategoriaAttributes } from '../types/categorias';


type CreateCategoriaBody = Omit<CategoriaAttributes, "id_categoria">

type UpdateCategoriaBody = Pick<CategoriaAttributes, "id_categoria" | "nome" | "ativo">;




export const getAllCategoria = async (req: Request, res: Response): Promise<Response | any> => {
    try {
        const categoriasAll = await Categorias.findAll();
        return res.status(200).json(categoriasAll);
    } catch (error: any) {
        console.error("Erro ao buscar categorias:", error);
        return res.status(500).json({
            mensagem: "Erro ao buscar categorias.",
            erro: error.message,
        });
    }
};

export const getIdCategoria = async (req: Request<{ id: string }>, res: Response): Promise<Response | any> => {
    const { id } = req.params;
    try {
        const categoria = await Categorias.findByPk(id);
        return res.status(200).json(categoria);
    } catch (error: any) {
        console.error("Erro ao buscar categoria:", error);
        return res.status(500).json({
            mensagem: "Erro ao buscar categoria.",
            erro: error.message,
        });
    }
};

export const createCategoria = async (
    req: Request<{}, {}, CreateCategoriaBody>,
    res: Response
): Promise<Response | any> => {
    try {
        const { nome, ativo, criado_por } = req.body;


        const categoria = await Categorias.create({
            nome,
            criado_por,
            ativo,
            data_criacao: new Date(),
        });

        return res.status(201).json({
            message: "Categoria criada com sucesso",
            categoria,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Erro ao adicionar item",
            error: error.message,
        });
    }
};

export const updateCategoria = async (
    req: Request<{}, {}, UpdateCategoriaBody>,
    res: Response
): Promise<Response | any> => {
    try {
        const { id_categoria, nome, ativo } = req.body;

        const categoriaExistente = await Categorias.findByPk(id_categoria);
        if (!categoriaExistente) {
            return res.status(404).json({ message: "Categoria não encontrada" });
        }

        const categoriaEditada = await Categorias.update(
            { nome, ativo },
            { where: { id_categoria } }
        );

        return res.status(200).json({
            message: "Categoria editada com sucesso",
            categoriaEditada,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Erro ao editar item",
            error: error.message,
        });
    }
};

export const deleteCategoria = async (
    req: Request<{}, {}, UpdateCategoriaBody>,
    res: Response
): Promise<Response | any> => {
    try {
        const { id_categoria, ativo } = req.body;

        // Verifica se a categoria existe
        const categoriaExistente = await Categorias.findByPk(id_categoria);

        if (!categoriaExistente) {
            return res.status(404).json({
                message: "Categoria não encontrada",
            });
        }

        // Impede a exclusão se a categoria estiver ativa
        if (ativo) {
            return res.status(400).json({
                message: "Categoria em uso, não é possível excluir.",
            });
        }

        // Remove a categoria
        await Categorias.destroy({
            where: { id_categoria },
        });

        return res.status(200).json({
            message: "Categoria removida com sucesso",
        });

    } catch (error: any) {
        console.error("Erro ao remover categoria:", error);
        return res.status(500).json({
            message: "Erro ao remover categoria",
            error: error.message,
        });
    }
};
