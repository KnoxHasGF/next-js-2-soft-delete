import { useEffect, useRef, useState } from "react";

import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = import.meta.env.VITE_API_URL;

export default function Item() {
  const [items, setItems] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState("");

  const newItemName = useRef(null);
  const newItemPrice = useRef(null);
  const newItemAmount = useRef(null);

  // GET all items
  const loadItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/item`);

      if (!response.ok) {
        console.error("GET Items failed:", response.status);
        return;
      }

      const data = await response.json();

      console.log("Items:", data.itemList);

      setItems(data.itemList || []);
    } catch (error) {
      console.error("GET Items Error:", error);
    }
  };

  // Load items when page opens
  useEffect(() => {
    loadItems();
  }, []);

  // Category change
  const onCategoryChange = (event) => {
    setNewItemCategory(event.target.value);
  };

  // Close dialog
  const closeDialog = () => {
    if (newItemName.current) {
      newItemName.current.value = "";
    }

    if (newItemPrice.current) {
      newItemPrice.current.value = "";
    }

    if (newItemAmount.current) {
      newItemAmount.current.value = "";
    }

    setNewItemCategory("");
    setOpenDialog(false);
  };

  // Add new item
  const onAddItem = async () => {
    const name = newItemName.current.value;
    const category = newItemCategory;
    const price = newItemPrice.current.value;
    const amount = newItemAmount.current.value;

    if (!name || !category || !price || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    const newItem = {
      name: name,
      category: category,
      price: price,
      amount: amount,
    };

    console.log("Adding item:", newItem);

    try {
      const response = await fetch(`${API_URL}/api/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      const data = await response.json();

      console.log("POST response:", data);

      if (response.ok) {
        alert("Item added successfully!");

        await loadItems();

        closeDialog();
      } else {
        alert("Failed to add item.");
      }
    } catch (error) {
      console.error("POST Item Error:", error);
      alert("Cannot connect to the backend.");
    }
  };

  // Delete item
  const onItemDelete = async (rowId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/item/${rowId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Item deleted successfully!");
        await loadItems();
      } else {
        alert("Failed to delete item.");
      }
    } catch (error) {
      console.error("DELETE Item Error:", error);
    }
  };

  // DataGrid columns
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 3,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 3,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 2,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 2,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <IconButton
            onClick={() => {
              onItemDelete(params.row._id);
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        );
      },
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 px-1">
        <Typography variant="h6">
          Items
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            console.log("Add Item clicked");
            setOpenDialog(true);
          }}
        >
          Add Item
        </Button>
      </div>

      {/* Item Table */}
      <Card>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={items}
            columns={columns}
            getRowId={(row) => row._id}
          />
        </div>
      </Card>

      {/* Add Item Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth
      >
        <DialogContent>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Add New Item
          </Typography>

          <div className="flex flex-col gap-2">

            {/* Item Name */}
            <TextField
              required
              label="Item Name"
              inputRef={newItemName}
              fullWidth
            />

            {/* Category */}
            <FormControl fullWidth>
              <InputLabel id="item-category-label">
                Item Category
              </InputLabel>

              <Select
                labelId="item-category-label"
                value={newItemCategory}
                label="Item Category"
                onChange={onCategoryChange}
              >
                <MenuItem value="Appliance">
                  Appliance
                </MenuItem>

                <MenuItem value="Gadget">
                  Gadget
                </MenuItem>

                <MenuItem value="Headphone">
                  Headphone
                </MenuItem>

                <MenuItem value="Stationary">
                  Stationary
                </MenuItem>
              </Select>
            </FormControl>

            {/* Price */}
            <TextField
              required
              label="Price"
              inputRef={newItemPrice}
              fullWidth
            />

            {/* Amount */}
            <TextField
              required
              label="Amount"
              inputRef={newItemAmount}
              fullWidth
            />

          </div>
        </DialogContent>

        {/* Dialog Buttons */}
        <DialogActions>
          <Button onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={onAddItem}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}