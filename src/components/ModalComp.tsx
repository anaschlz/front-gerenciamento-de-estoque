import { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
} from "@chakra-ui/react";

interface Product {
  product_id: number;
  product_name: string;
  product_amount: number;
  product_price: number;
}

interface Props {
  product: any;
  setProducts: any;
  isOpen: any;
  onClose: any;
  setProductToEdit: (product: Product | null) => void;
}

const ModalComp = ({ product, setProducts, isOpen, onClose}: Props) => {
  const [productName, setProductName] = useState(product.product_name || "");
  const [productAmount, setProductAmount] = useState(Number(product.product_amount) || 0);
  const [productPrice, setProductPrice] = useState(Number(product.product_price) || 0);

  const handleSave = async () => {
    if (!productName || !productAmount || !productPrice) return;

    try {
      const data = {
        product_name: productName,
        product_amount: productAmount,
        product_price: productPrice,
      };

      if (product.product_id) {
        await axios.put(`https://api-gerenciamento-de-estoque.vercel.app/api/product/${product.product_id}/`, data);
      } else {
        await axios.post(`https://api-gerenciamento-de-estoque.vercel.app/api/data/${product.product_id}/`, data);
      }

      const response = await axios.get("https://api-gerenciamento-de-estoque.vercel.app/api/product/");
      setProducts(response.data);

      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://api-gerenciamento-de-estoque.vercel.app/api/data/${product.product_id}/`);

      const response = await axios.get("https://api-gerenciamento-de-estoque.vercel.app/api/product/");
      setProducts(response.data);

      onClose();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{product.product_id ? "Editar Produto" : "Novo Produto"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl display="flex" flexDir="column" gap={4}>
              <Box>
                <FormLabel>Nome do Produto</FormLabel>
                <Input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel>Quantidade</FormLabel>
                <Input
                  type="number"
                  value={productAmount}
                  onChange={(e) => setProductAmount(Number(e.target.value))}
                />
              </Box>
              <Box>
                <FormLabel>Preço</FormLabel>
                <Input
                  type="text"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                />
              </Box>
            </FormControl>
          </ModalBody>

          <ModalFooter justifyContent="start">
            <Button colorScheme="green" mr={3} onClick={handleSave}>
              {product.product_id ? "Atualizar" : "Salvar"}
            </Button>
            {product.product_id && (
              <Button colorScheme="red" onClick={handleDelete}>
                Excluir
              </Button>
            )}
            <Button colorScheme="gray" ml={2} onClick={onClose}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComp;
